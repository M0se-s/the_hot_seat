"use client";

import { useEffect, useMemo, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { AvatarSession, AvatarVideo, ControlBar, useTranscript, useAvatarSession } from "@runwayml/avatars-react";

import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { endRunwaySession, getProject, getSession, getSessionType, startRunwaySession } from "@/lib/api";
import type { Project, RunwayStartResponse, Session, SessionType } from "@/lib/types";

export interface RunwayCharacterStageHandle {
    disconnect: () => Promise<void>;
}

type RunwayCharacterStageProps = {
    sessionId: string;
    /** Called once the Runway character is connected and credentials are live. */
    onConnected?: () => void;
    /** Called when the Runway SDK updates the real-time transcript. */
    onTranscriptChange?: (text: string) => void;
};

type StageStatus = "loading" | "disconnected" | "connecting" | "connected" | "error";

/**
 * Helper component to capture the 'end' function from the Runway SDK.
 * Must be rendered inside <AvatarSession>.
 */
function DisconnectManager({ onCapture }: { onCapture: (endFn: () => void) => void }) {
    const { end } = useAvatarSession();
    useEffect(() => {
        onCapture(end);
    }, [end, onCapture]);
    return null;
}

export const RunwayCharacterStage = forwardRef<RunwayCharacterStageHandle, RunwayCharacterStageProps>(
    ({ sessionId, onConnected, onTranscriptChange }, ref) => {
        const [session, setSession] = useState<Session | null>(null);
        const [project, setProject] = useState<Project | null>(null);
        const [sessionType, setSessionType] = useState<SessionType | null>(null);
        const [runwaySession, setRunwaySession] = useState<RunwayStartResponse | null>(null);
        const [isConnecting, setIsConnecting] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        
        const hasStartedRef = useRef(false);
        const sdkDisconnectRef = useRef<(() => void) | null>(null);

        // Expose disconnect to parent
        useImperativeHandle(ref, () => ({
            disconnect: handleEndCharacter
        }));

        useEffect(() => {
            async function load() {
                try {
                    setError(null);

                    const foundSession = await getSession(sessionId);
                    if (!foundSession) {
                        setSession(null);
                        setProject(null);
                        setSessionType(null);
                        return;
                    }

                    setSession(foundSession);

                    const foundProject = await getProject(foundSession.projectId);
                    setProject(foundProject);

                    if (foundProject) {
                        const foundSessionType = await getSessionType(foundProject.sessionTypeId);
                        setSessionType(foundSessionType);
                    }
                } catch (loadError) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "Unable to reach backend. Make sure FastAPI is running at http://localhost:8000.",
                    );
                } finally {
                    setIsLoading(false);
                }
            }

            load();
        }, [sessionId]);

        // Cleanup on unmount
        useEffect(() => {
            return () => {
                if (sdkDisconnectRef.current) {
                    console.log("RunwayCharacterStage: Explicitly disconnecting SDK on unmount");
                    sdkDisconnectRef.current();
                    sdkDisconnectRef.current = null;
                }
            };
        }, []);

        const activeJudge = useMemo(() => {
            if (!sessionType) {
                return null;
            }

            return (
                sessionType.judges.find((judge) => judge.id === session?.activeJudgeId) ??
                sessionType.judges[0] ??
                null
            );
        }, [session?.activeJudgeId, sessionType]);

        const avatarId = activeJudge?.avatarId ?? null;

        const credentials = useMemo(() => {
            if (!runwaySession?.raw || typeof runwaySession.raw !== "object") {
                return null;
            }

            const raw = runwaySession.raw as Record<string, unknown>;
            const nestedRaw = raw.raw && typeof raw.raw === "object" ? (raw.raw as Record<string, unknown>) : null;
            const consume = raw.consume ?? nestedRaw?.consume;

            if (!consume || typeof consume !== "object") {
                return null;
            }

            const consumeRecord = consume as Record<string, unknown>;
            const serverUrl = typeof consumeRecord.url === "string" ? consumeRecord.url : null;
            const token = typeof consumeRecord.token === "string" ? consumeRecord.token : null;
            const roomName =
                typeof consumeRecord.roomName === "string" ? consumeRecord.roomName : null;

            if (!serverUrl || !token || !roomName) {
                return null;
            }

            return {
                sessionId: runwaySession.sessionId,
                serverUrl,
                token,
                roomName,
            };
        }, [runwaySession]);

        async function handleConnect() {
            if (!avatarId || isConnecting || runwaySession || hasStartedRef.current) {
                return;
            }

            hasStartedRef.current = true;

            try {
                setIsConnecting(true);
                setError(null);

                const response = await startRunwaySession(sessionId);
                setRunwaySession(response);
                onConnected?.();
            } catch (connectError) {
                hasStartedRef.current = false;
                console.error("Runway SDK Connection Error:", connectError);
                setError(
                    connectError instanceof Error
                        ? connectError.message
                        : "Runway Character failed to connect. Manual transcript mode is still available.",
                );
            } finally {
                setIsConnecting(false);
            }
        }

        async function handleEndCharacter() {
            console.log("Ending Runway Character session...");
            
            // 1. Disconnect SDK
            if (sdkDisconnectRef.current) {
                sdkDisconnectRef.current();
                sdkDisconnectRef.current = null;
            }

            // 2. Notify Backend
            try {
                await endRunwaySession(sessionId);
            } catch (err) {
                console.warn("Backend runway/end call failed, but frontend is disconnected:", err);
            }

            // 3. Clear State
            setRunwaySession(null);
            hasStartedRef.current = false;
        }

        const stageStatus: StageStatus = isLoading
            ? "loading"
            : error
                ? "error"
                : runwaySession
                    ? "connected"
                    : isConnecting
                        ? "connecting"
                        : "disconnected";

        if (isLoading) {
            return (
                <Panel className="flex min-h-[400px] items-center justify-center p-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                        <p className="text-sm text-zinc-500 font-medium">Initializing Runway Character...</p>
                    </div>
                </Panel>
            );
        }

        if (!session || !project || !sessionType || !activeJudge || !avatarId) {
            return (
                <Panel className="space-y-4 p-6 min-h-[400px]">
                    <div>
                        <Badge variant="warning">Runway Character</Badge>
                        <h2 className="mt-3 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Runway unavailable.</h2>
                        <p className="mt-2 text-sm text-zinc-500">
                            Manual transcript mode is still available.
                            End the session with transcript notes to generate a credibility report.
                        </p>
                    </div>
                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                            {error}
                        </div>
                    ) : null}
                </Panel>
            );
        }

        return (
            <Panel className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Badge variant={stageStatus === "connected" ? "accent" : "warning"}>
                            Runway Character
                        </Badge>
                        <h2 className="mt-3 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                            {activeJudge.name}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-red-500/80 uppercase tracking-wider">{activeJudge.roleName}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {runwaySession && (
                            <button
                                type="button"
                                onClick={handleEndCharacter}
                                className="text-xs font-semibold text-zinc-400 hover:text-red-500 transition-colors"
                            >
                                End Character
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleConnect}
                            disabled={isConnecting || Boolean(runwaySession)}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                        >
                            {isConnecting ? "Connecting..." : runwaySession ? "Connected" : "Connect"}
                        </button>
                    </div>
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Connect the active judge as a live Runway Character. Manual transcript
                    mode remains available as fallback if the connection drops.
                </p>

                {error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                        <p className="text-sm font-medium text-red-700 dark:text-red-200">Connection error</p>
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : null}

                <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50 min-h-[360px]">
                    {!runwaySession ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            <div className="mb-4 rounded-full bg-zinc-100 p-3 dark:bg-zinc-900">
                                <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[240px]">
                                Character not connected. Click Connect to begin the live session.
                            </p>
                        </div>
                    ) : !credentials ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-sm text-red-700 dark:text-red-200 font-medium">Credential Mismatch</p>
                            <p className="mt-2 text-xs text-zinc-500 max-w-[240px]">
                                Connected session is missing transport credentials. Manual transcript mode is still available.
                            </p>
                        </div>
                    ) : (
                        <AvatarSession
                            credentials={credentials}
                            audio
                            video={false}
                            onError={(avatarError) => {
                                console.error("Runway SDK Avatar Error:", avatarError);
                                setError(
                                    avatarError instanceof Error ? avatarError.message : String(avatarError),
                                );
                            }}
                        >
                            <DisconnectManager onCapture={(fn) => { sdkDisconnectRef.current = fn; }} />
                            <div className="space-y-4 p-4">
                                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 shadow-inner">
                                    <AvatarVideo className="h-[400px] w-full object-cover" />
                                    {onTranscriptChange && <RunwayTranscriptListener onTranscriptChange={onTranscriptChange} />}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <ControlBar />
                                </div>
                            </div>
                        </AvatarSession>
                    )}
                </div>

                {runwaySession && (
                    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 text-[10px] uppercase tracking-widest text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/30">
                        <span>Runway Character Live</span>
                        <span className="font-mono lowercase tracking-normal">ID: {runwaySession.sessionId}</span>
                    </div>
                )}
            </Panel>
        );
    }
);

RunwayCharacterStage.displayName = "RunwayCharacterStage";

function RunwayTranscriptListener({ onTranscriptChange }: { onTranscriptChange: (text: string) => void }) {
    const transcript = useTranscript({ interim: true });

    useEffect(() => {
        if (!transcript || transcript.length === 0) return;
        
        const lines = transcript.map(entry => {
            const speaker = entry.participantIdentity.startsWith('user') ? 'You' : 'Judge';
            return `${speaker}: ${entry.text}`;
        });
        
        onTranscriptChange(lines.join('\n'));
    }, [transcript, onTranscriptChange]);

    return null;
}

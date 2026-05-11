"use client";

import { useEffect, useMemo, useState } from "react";
import { AvatarSession, AvatarVideo, ControlBar, useTranscript } from "@runwayml/avatars-react";

import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { getProject, getSession, getSessionType, startRunwaySession } from "@/lib/api";
import type { Project, RunwayStartResponse, Session, SessionType } from "@/lib/types";

type RunwayCharacterStageProps = {
    sessionId: string;
    /** Called once the Runway character is connected and credentials are live. */
    onConnected?: () => void;
    /** Called when the Runway SDK updates the real-time transcript. */
    onTranscriptChange?: (text: string) => void;
};

type StageStatus = "loading" | "disconnected" | "connecting" | "connected" | "error";

export function RunwayCharacterStage({ sessionId, onConnected, onTranscriptChange }: RunwayCharacterStageProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [sessionType, setSessionType] = useState<SessionType | null>(null);
    const [runwaySession, setRunwaySession] = useState<RunwayStartResponse | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        if (!avatarId || isConnecting || runwaySession) {
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);

            const response = await startRunwaySession(sessionId);
            setRunwaySession(response);
            onConnected?.();
        } catch (connectError) {
            setError(
                connectError instanceof Error
                    ? connectError.message
                    : "Runway Character failed to connect",
            );
        } finally {
            setIsConnecting(false);
        }
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
            <Panel className="flex min-h-100 items-center justify-center p-6">
                <p className="text-sm text-zinc-500">Connecting Runway Character...</p>
            </Panel>
        );
    }

    if (!session || !project || !sessionType || !activeJudge || !avatarId) {
        return (
            <Panel className="space-y-4 p-6">
                <div>
                    <Badge variant="warning">Runway Character</Badge>
                    <h2 className="mt-3 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Runway did not connect.</h2>
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
                    <p className="mt-2 text-sm text-zinc-500">{activeJudge.roleName}</p>
                    <p className="mt-3 text-sm text-zinc-500">
                        Connect the active judge as a live Runway Character. Manual transcript
                        mode remains available as fallback.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleConnect}
                    disabled={isConnecting || Boolean(runwaySession)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isConnecting ? "Connecting..." : runwaySession ? "Connected" : "Connect"}
                </button>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                    <p className="text-sm font-medium text-red-700 dark:text-red-200">Runway did not connect.</p>
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
                    <p className="mt-1 text-xs text-red-500 dark:text-red-500">Manual transcript mode is still available.</p>
                </div>
            ) : null}

            {!runwaySession ? (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
                    Character not connected. Click Connect to begin the live session.
                </div>
            ) : !credentials ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                    <p className="text-sm text-red-700 dark:text-red-200">Runway did not connect.</p>
                    <p className="mt-1 text-xs text-red-500">Connected session is missing transport credentials. Manual transcript mode is still available.</p>
                </div>
            ) : (
                <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <AvatarSession
                        credentials={credentials}
                        audio
                        video={false}
                        onError={(avatarError) => {
                            setError(
                                avatarError instanceof Error ? avatarError.message : String(avatarError),
                            );
                        }}
                    >
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
                                <AvatarVideo className="h-90 w-full" />
                                {onTranscriptChange && <RunwayTranscriptListener onTranscriptChange={onTranscriptChange} />}
                            </div>

                            <div className="flex justify-end">
                                <ControlBar />
                            </div>
                        </div>
                    </AvatarSession>

                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-400">
                        <p>Runway Character connected.</p>
                        <p className="mt-1 break-all text-zinc-400 dark:text-zinc-500">
                            Session ID: {runwaySession.sessionId}
                        </p>
                    </div>
                </div>
            )}
        </Panel>
    );
}

function RunwayTranscriptListener({ onTranscriptChange }: { onTranscriptChange: (text: string) => void }) {
    const transcript = useTranscript({ interim: true });

    useEffect(() => {
        if (!transcript || transcript.length === 0) return;
        
        const lines = transcript.map(entry => {
            const speaker = entry.participantIdentity === 'user' ? 'You' : 'Judge';
            return `${speaker}: ${entry.text}`;
        });
        
        onTranscriptChange(lines.join('\n'));
    }, [transcript, onTranscriptChange]);

    return null;
}
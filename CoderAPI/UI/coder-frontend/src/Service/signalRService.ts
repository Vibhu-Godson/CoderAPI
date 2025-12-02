import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { API_URLS } from "../api/api_urls";

// CORRECTED CASING: These types now match the camelCase structure of the incoming C# JSON payload
type TestcaseUpdatePayload = {
    userTestCaseResultId: number;
    testCaseId: number;
    status: string;
    Input: string;         
    ExpectedOutput: string; 
    stdout?: string | null;
    stderr?: string | null;
    compileOutput?: string | null;
    executionTime?: number | null;
    memoryUsed?: number | null;
};

type ExecutionCompletedPayload = {
    userSolutionId: number;
    status: string;
    message?: string;
};

class SignalRService {
    private connection: HubConnection | null = null;
    private onTestcaseUpdateHandlers: Array<(payload: TestcaseUpdatePayload) => void> = [];
    private onExecutionCompletedHandlers: Array<(payload: ExecutionCompletedPayload) => void> = [];
    private connectingPromise: Promise<void> | null = null;

    /** Connect to SignalR Hub (waits until fully connected) */
    async connect(): Promise<void> {
        if (this.connection && this.connection.state === "Connected") return;
        if (this.connectingPromise) return this.connectingPromise; // already connecting

        this.connection = new HubConnectionBuilder()
            .withUrl(API_URLS.hub.submission, {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        // register handlers
        this.connection.on("ReceiveTestCaseResult", (payload: TestcaseUpdatePayload) => {
            this.onTestcaseUpdateHandlers.forEach((h) => h(payload));
        });

        this.connection.on("ExecutionCompleted", (payload: ExecutionCompletedPayload) => {
            this.onExecutionCompletedHandlers.forEach((h) => h(payload));
        });

        this.connectingPromise = this.connection
            .start()
            .then(() => {
                console.info("SignalR connected");
                this.connectingPromise = null;
            })
            .catch((err) => {
                this.connectingPromise = null;
                console.error("SignalR connection failed", err);
                throw err;
            });

        return this.connectingPromise;
    }

    /** Disconnect from hub */
    async disconnect(): Promise<void> {
        if (!this.connection) return;
        try {
            await this.connection.stop();
        } finally {
            this.connection = null;
        }
    }

    /** Join a session-level group (e.g. userProblemSessionId) */
    async joinSessionGroup(userProblemSessionId: number | string): Promise<void> {
        if (!this.connection || this.connection.state !== "Connected") {
            await this.connect();
        }
        if (!this.connection) throw new Error("SignalR connection not established.");
        // Backend may expect string ID
        return this.connection.invoke("JoinSessionGroup", String(userProblemSessionId));
    }

    /** Join a specific solution group (per run/submit). Accepts userSolutionId */
    async joinSolutionGroup(userSolutionId: number | string): Promise<void> {
        if (!this.connection || this.connection.state !== "Connected") {
            await this.connect();
        }
        if (!this.connection) throw new Error("SignalR connection not established.");
        return this.connection.invoke("JoinSolutionGroup", String(userSolutionId));
    }

    /** Leave a solution group safely */
    async leaveSolutionGroup(userSolutionId: number | string): Promise<void> {
        if (!this.connection || this.connection.state !== "Connected") return;
        try {
            await this.connection.invoke("LeaveSolutionGroup", String(userSolutionId));
        } catch (ex) {
            console.warn("LeaveSolutionGroup failed", ex);
        }
    }

    /** Register handler for testcase updates */
    onTestcaseUpdate(handler: (payload: TestcaseUpdatePayload) => void) {
        this.onTestcaseUpdateHandlers.push(handler);
        return () => {
            this.onTestcaseUpdateHandlers = this.onTestcaseUpdateHandlers.filter((h) => h !== handler);
        };
    }

    /** Register handler for execution completed */
    onExecutionCompleted(handler: (payload: ExecutionCompletedPayload) => void) {
        this.onExecutionCompletedHandlers.push(handler);
        return () => {
            this.onExecutionCompletedHandlers = this.onExecutionCompletedHandlers.filter((h) => h !== handler);
        };
    }

    /** Helper to check if connection is active */
    isConnected(): boolean {
        return this.connection?.state === "Connected";
    }
}

export const signalRService = new SignalRService();
export type { TestcaseUpdatePayload, ExecutionCompletedPayload };

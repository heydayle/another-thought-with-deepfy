
export interface WorkflowRunRequest {
    inputs: Record<string, any>;
    response_mode: "blocking" | "streaming";
    user: string;
}

export interface WorkflowRunResponse {
    log_id: string;
    task_id: string;
    data: {
        id: string;
        workflow_id: string;
        status: string;
        outputs: Record<string, any>;
        error: any;
        elapsed_time: number;
        total_tokens: number;
        total_steps: number;
        created_at: number;
        finished_at: number;
    };
}

const getBaseUrl = () => {
    let url = import.meta.env.VITE_DIFY_BASE_URL;
    if (url && url.endsWith("/")) {
        url = url.slice(0, -1);
    }
    return url;
};

export const runWorkflow = async (
    inputs: Record<string, any>,
    user: string = "abc-123"
): Promise<WorkflowRunResponse> => {
    const apiKey = import.meta.env.VITE_DIFY_API_KEY;
    const baseUrl = getBaseUrl();

    if (!apiKey) {
        throw new Error("Dify API Key is missing. Check VITE_DIFY_API_KEY in .env");
    }
    if (!baseUrl) {
        throw new Error("Dify Base URL is missing. Check VITE_DIFY_BASE_URL in .env");
    }

    const response = await fetch(`${baseUrl}/workflows/run`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            inputs,
            response_mode: "blocking",
            user,
        } as WorkflowRunRequest),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Dify API Error: ${response.status} - ${errorBody}`);
    }

    return response.json();
};

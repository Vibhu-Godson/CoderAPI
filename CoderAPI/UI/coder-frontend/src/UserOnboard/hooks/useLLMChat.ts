import { useCallback } from "react";
import { LLMExtraction } from "../types";

// TODO: Replace with your real LLM call.
// Must return { role?, education?, experience?, project?, motivation? }
async function mockExtract(userText: string): Promise<LLMExtraction> {
    const lower = userText.toLowerCase();

    const out: LLMExtraction = {};

    // naive role hints
    if (lower.includes("student")) out.role = "student";
    if (lower.includes("job") && lower.includes("seeking")) out.role = "job_seeker";
    if (lower.includes("intern") || lower.includes("0-2")) out.role = "professional_0_2";
    if (lower.includes("2-5")) out.role = "professional_2_5";
    if (lower.includes("5-10")) out.role = "professional_5_10";
    if (lower.includes("10")) out.role = "professional_10_plus";

    // heuristic extraction examples
    const instituteMatch = userText.match(/(?:at|from)\s+([A-Za-z0-9 .&-]{3,})/i);
    if (instituteMatch) {
        out.education = {
            institute: instituteMatch[1].trim(),
        };
    }
    if (lower.includes("btech")) out.education = { ...(out.education || {}), degree: "BTech" };
    if (lower.includes("mtech")) out.education = { ...(out.education || {}), degree: "MTech" };
    if (lower.includes("cse")) out.education = { ...(out.education || {}), fieldOfStudy: "Computer Science" };

    const companyMatch = userText.match(/(?:at|@)\s*([A-Za-z0-9 .&-]{2,})/i);
    if (companyMatch) {
        out.experience = { ...(out.experience || {}), company: companyMatch[1].trim() };
    }
    if (lower.includes("engineer")) out.experience = { ...(out.experience || {}), role: "Engineer" };

    const projectMatch = userText.match(/project\s+['"]?([^'"]{3,})/i);
    if (projectMatch) {
        out.project = { title: projectMatch[1].trim() };
    }

    // motivation catch-all
    if (lower.includes("because") || lower.includes("want") || lower.includes("goal")) {
        out.motivation = userText;
    }

    return new Promise((res) => setTimeout(() => res(out), 250));
}

export function useLLMChat() {
    const extract = useCallback(async (userText: string) => {
        // REPLACE this with your real LLM endpoint call
        const result = await mockExtract(userText);
        return result;
    }, []);

    return { extract };
}

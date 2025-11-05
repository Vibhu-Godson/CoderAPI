import { useState, useEffect } from "react";
import {
    useGetLanguagesByProblemIdQuery,
    useGetStarterCodeByDetailIdQuery,
} from "../problemDetailApi";
import { useGetProblemByIdQuery } from "../problemApi";

export function useProblemData(problemId: number) {
    const { data: problem, error, isError, isLoading, isSuccess } =
        useGetProblemByIdQuery(problemId);
    const { data: languagesData, isLoading: langsLoading } =
        useGetLanguagesByProblemIdQuery(problemId);

    const [selectedProblemDetailId, setSelectedProblemDetailId] = useState<number | null>(null);
    const { data: starterCodeData, isLoading: codeLoading } = useGetStarterCodeByDetailIdQuery(
        selectedProblemDetailId!,
        { skip: !selectedProblemDetailId }
    );

    const [language, setLanguage] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (isError && "status" in (error as any) && (error as any).status === 403) {
            setIsLocked(true);
        }
    }, [isError, error]);

    useEffect(() => {
        if (languagesData?.items?.length && !language) {
            const firstLang = languagesData.items[0];
            setLanguage(firstLang.value);
            setSelectedProblemDetailId(firstLang.problemDetailId);
        }
    }, [languagesData, language]);

    useEffect(() => {
        if (starterCodeData?.value) setCode(starterCodeData.value);
    }, [starterCodeData]);

    return {
        problem,
        languagesData,
        selectedProblemDetailId,
        setSelectedProblemDetailId,
        language,
        setLanguage,
        code,
        setCode,
        isLocked,
        isLoading: isLoading || langsLoading || codeLoading,
        isSuccess,
    };
}

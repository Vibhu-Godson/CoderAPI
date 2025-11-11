export const EyeIcon = ({ open }: { open: boolean }) => (
    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        {open ? (
            <path d="M1 1l22 22M10.58 10.58A2 2 0 1112 14a2 2 0 01-1.42-3.42z" />
        ) : (
            <>
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
    </svg>
);

export const GoogleIcon = () => (
    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
);
export const FacebookIcon = () => (
    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" />
);


/// <reference types="vite/client" />

interface Window {
    html2pdf: any;
}

interface Navigator {
    bluetooth?: {
        requestDevice(options: {
            acceptAllDevices?: boolean;
            optionalServices?: string[];
        }): Promise<{
            name: string;
        }>;
    };
}

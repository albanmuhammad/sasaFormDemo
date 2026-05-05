"use client";

import { useState } from "react";

// Polls until the SDK is ready or timeout is reached
function waitForSalesforceSDK(timeout = 10000): Promise<any> {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
            // Hanya resolve setelah init() selesai
            const sdk = (window as any).__sfsdk_ready;

            if (sdk?.sendEvent) {
                resolve(sdk);
                return;
            }

            if (Date.now() - start >= timeout) {
                reject(new Error("Salesforce SDK not available after timeout"));
                return;
            }

            setTimeout(check, 300);
        };

        check();
    });
}
export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const sdk = await waitForSalesforceSDK(10000);
            console.log("SDK ready, calling sendEvent...");

            const result = await sdk.sendEvent({
                user: {
                    attributes: {
                        eventType: "identity",
                        isAnonymous: 0,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phoneNumber: formData.phone,
                    },
                },
            });

            console.log("sendEvent result:", result);
            setStatus("success");
            setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });

        } catch (err) {
            console.error("Salesforce Error:", err);
            setStatus("error");
        }
    };

    // Ubah bagian inputClass Anda menjadi seperti ini:
    const inputClass =
        "w-full border-b border-zinc-300 py-3 bg-transparent text-zinc-900 placeholder:text-zinc-500 focus:border-red-600 focus:outline-none transition-colors";

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-8 bg-white shadow-sm rounded-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-8">Selalu Dekat Dengan Sasa</h2>

            <div className="flex flex-col gap-6">
                <input
                    required
                    placeholder="Nama Depan"
                    className={inputClass}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <input
                    required
                    placeholder="Nama Belakang"
                    className={inputClass}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                <input
                    required
                    type="email"
                    placeholder="Email"
                    className={inputClass}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    placeholder="No. Telp."
                    className={inputClass}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                    placeholder="Subyek"
                    className={inputClass}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                <textarea
                    placeholder="Pesan"
                    rows={3}
                    className={`${inputClass} resize-none`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`w-full text-white font-semibold py-3 rounded transition-colors ${status === "loading" ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                        }`}
                >
                    {status === "loading" ? "Mengirim..." : "Kirim"}
                </button>

                {status === "success" && (
                    <p className="text-green-600 text-sm text-center">Pesan berhasil dikirim!</p>
                )}
                {status === "error" && (
                    <p className="text-red-600 text-sm text-center">Gagal mengirim. Mohon coba lagi.</p>
                )}
            </div>
        </form>
    );
}
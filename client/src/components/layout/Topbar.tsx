import Button from "../ui/Button";
import { toast } from "react-toastify";

export default function Topbar() {
    return (
        <header className="sticky top-0 z-40 bg-white border-b">
            <div className="flex items-center gap-2 px-4 h-14">
                <div className="md:hidden font-bold text-brand-700">
                    Trackify
                </div>
                <div className="ms-auto flex items-center gap-2">
                    <Button
                        onClick={() =>
                            toast.info("This is a placeholder notification")
                        }
                        className="hidden sm:inline-flex"
                    >
                        Test Toast
                    </Button>
                    <img
                        src="https://api.dicebear.com/9.x/identicon/svg?seed=you"
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
            </div>
        </header>
    );
}

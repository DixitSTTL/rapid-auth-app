import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    // Verify token on mount
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/verify");
        
        if (!response.ok) {
          // Token expired or invalid
          router.push("/login");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        router.push("/login");
      }
    };

    verifyToken();

    // Optional: Re-verify token every 5 minutes
    const interval = setInterval(verifyToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);
}

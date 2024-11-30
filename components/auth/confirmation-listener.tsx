import { useEffect, useState } from "react";

import { CheckCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export const ConfirmationListener = () => {
  const supabase = createClient();

  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const checkEmailConfirmation = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setIsConfirmed(true);
        router.push("/dashboard");
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        checkEmailConfirmation();
      }
    });

    // Check immediately in case the email was already confirmed
    checkEmailConfirmation();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <p
      className="flex items-center justify-center gap-2 text-lg"
      data-testid="confirmation-listener"
    >
      {isConfirmed ? (
        <>
          <CheckCircle
            className="h-5 w-5 text-primary"
            data-testid="check-circle-icon"
          />
          Email confirmed! Redirecting to dashboard...
        </>
      ) : (
        <>
          <RefreshCw
            className="h-5 w-5 animate-spin text-primary"
            data-testid="refresh-icon"
          />
          Waiting for email confirmation...
        </>
      )}
    </p>
  );
};

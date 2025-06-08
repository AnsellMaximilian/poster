import { useUser } from "@/context/user/UserContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";
import { toast } from "sonner";
import { copyToClipboard, getErrorMessage } from "./utils";

export function toastError(message: string) {
  toast(message, {
    className: "font-playpen-sans",
    style: {
      backgroundColor: "#f44336",
      color: "#fff",
    },
    icon: <X />,
  });
}

export function copyToClipboardWithToaster(text: string) {
  try {
    copyToClipboard(text);
    toast("Copied to clipboard!", {
      className: "font-playpen-sans",
    });
  } catch (e) {
    toastError(getErrorMessage(e));
  }
}

export const privateRoute = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => {
  const ComponentWithPrivateRoute = (props: P) => {
    const { isLoading, currentUser } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !currentUser) {
        router.push("/app/login");
      }
    }, [isLoading, currentUser, router]);

    if (isLoading || !currentUser) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithPrivateRoute;
};

export const publicRoute = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => {
  const ComponentWithPublicRoute = (props: P) => {
    const { isLoading, currentUser } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && currentUser) {
        router.push("/app/dashboard");
      }
    }, [isLoading, currentUser, router]);

    if (isLoading || currentUser) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithPublicRoute;
};

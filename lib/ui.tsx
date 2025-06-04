import { useUser } from "@/context/user/UserContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";
import { toast } from "sonner";

export function toastError(message: string) {
  toast(message, {
    style: {
      backgroundColor: "#f44336",
      color: "#fff",
    },
    icon: <X />,
  });
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

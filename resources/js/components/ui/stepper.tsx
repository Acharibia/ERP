import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/* ---------------------------------- Types ---------------------------------- */
type StepState = "completed" | "active" | "inactive" | "disabled";

interface StepperContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
  maxSteps: number;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  nextStep: () => void;
  prevStep: () => void;
}

interface StepperItemContextValue {
  step: number;
  state: StepState;
  icon?: LucideIcon; // Added icon to context
}

/* -------------------------------- Contexts -------------------------------- */
const StepperContext = React.createContext<StepperContextValue | undefined>(undefined);
const StepperItemContext = React.createContext<StepperItemContextValue | undefined>(undefined);

/* ------------------------------ Hook exports ------------------------------ */
export function useStepper() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper component");
  }
  return context;
}

export function useStepperItem() {
  const context = React.useContext(StepperItemContext);
  if (!context) {
    throw new Error("useStepperItem must be used within a StepperItem component");
  }
  return context;
}

/* ----------------------------- Stepper Root ----------------------------- */
interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number;
  onStepChange: (step: number) => void; // Renamed
  children: React.ReactNode;
}


export function Stepper({
  value,
  onStepChange,
  children,
  className,
  ...props
}: StepperProps) {
  const childrenArray = React.Children.toArray(children);
  const maxSteps = childrenArray.length;

  const isNextDisabled = value >= maxSteps;
  const isPrevDisabled = value <= 1;

  const nextStep = React.useCallback(() => {
    if (value < maxSteps) {
      onStepChange(value + 1);
    }
  }, [value, maxSteps, onStepChange]);

  const prevStep = React.useCallback(() => {
    if (value > 1) {
      onStepChange(value - 1);
    }
  }, [value, onStepChange]);

  const contextValue = React.useMemo(() => ({
    activeStep: value,
    setActiveStep: onStepChange,
    maxSteps,
    isNextDisabled,
    isPrevDisabled,
    nextStep,
    prevStep
  }), [value, onStepChange, maxSteps, isNextDisabled, isPrevDisabled, nextStep, prevStep]);

  return (
    <StepperContext.Provider value={contextValue}>
      <div className={cn("block w-full", className)} {...props}>
        {children}
      </div>
    </StepperContext.Provider>
  );
}

/* ----------------------------- Stepper Item ----------------------------- */
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  children: React.ReactNode;
  icon?: LucideIcon; // Added icon prop
}

export function StepperItem({
  step,
  icon, // Added icon param
  children,
  className,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  // Determine the state of this step
  let state: StepState = "inactive";
  if (step === activeStep) {
    state = "active";
  } else if (step < activeStep) {
    state = "completed";
  }

  const contextValue = React.useMemo(() => ({
    step,
    state,
    icon // Pass icon to context
  }), [step, state, icon]);

  return (
    <StepperItemContext.Provider value={contextValue}>
      <div
        className={cn(
          "relative flex w-full flex-col items-center justify-center",
          className
        )}
        data-state={state}
        data-disabled={undefined}
        {...props}
      >
        {children}
      </div>
    </StepperItemContext.Provider>
  );
}

/* -------------------------- Stepper Separator -------------------------- */
type StepperSeparatorProps = React.HTMLAttributes<HTMLDivElement>

export function StepperSeparator({ className, ...props }: StepperSeparatorProps) {
    const { state } = useStepperItem();

    return (
      <div
        className={cn(
          "absolute h-0.5 -right-1/2 left-1/2 top-5 bg-muted",
          state === "completed" && "bg-primary",
          className
        )}
        {...props}
      />
    );
  }

/* ---------------------------- Stepper Trigger ---------------------------- */
interface StepperTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children?: React.ReactNode;
  asChild?: boolean;
}

export function StepperTrigger({
  asChild = false,
  onClick,
  className,
  children,
  ...props
}: StepperTriggerProps) {
  const { setActiveStep } = useStepper();
  const { step, state, icon: Icon } = useStepperItem(); // Get icon from context

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (state !== "disabled") {
      setActiveStep(step);
    }
  };

  // If we have an icon and no children, render the icon
  if (Icon && !children && !asChild) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(className)}
        disabled={state === "disabled" || props.disabled}
        {...props}
      >
        <Icon className="h-5 w-5" />
      </button>
    );
  }

    if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    if (!React.isValidElement(child)) return null;
    return React.cloneElement(child, {
        onClick: handleClick,
        disabled: state === "disabled" || props.disabled,
        ...props,
    });
    }



  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(className)}
      disabled={state === "disabled" || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------------------- Stepper Title ---------------------------- */
type StepperTitleProps = React.HTMLAttributes<HTMLHeadingElement>

export function StepperTitle({ className, children, ...props }: StepperTitleProps) {
  const { state } = useStepperItem();

  return (
    <h3
      className={cn(
        "text-sm font-semibold transition lg:text-base",
        state === "active" && "text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

/* -------------------------- Stepper Description -------------------------- */
type StepperDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

export function StepperDescription({ className, children, ...props }: StepperDescriptionProps) {
  const { state } = useStepperItem();

  return (
    <p
      className={cn(
        "sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm",
        state === "active" && "text-primary",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/* -------------------------- Stepper Indicator -------------------------- */
type StepperIndicatorProps = React.HTMLAttributes<HTMLDivElement>

export function StepperIndicator({ className, children, ...props }: StepperIndicatorProps) {
  const { state, icon: Icon } = useStepperItem(); // Get icon from context

  return (
    <div
      className={cn(
        "z-10 rounded-full shrink-0",
        "ring-offset-background",
        state === "active" && "ring-2 ring-ring ring-offset-2",
        className
      )}
      {...props}
    >
      {/* Render the icon if provided, otherwise render children */}
      {Icon ? <Icon className="h-5 w-5" /> : children}
    </div>
  );
}

/* -------------------------- Exports -------------------------- */
export {
  Stepper as Root,
  StepperItem as Item,
  StepperSeparator as Separator,
  StepperTrigger as Trigger,
  StepperTitle as Title,
  StepperDescription as Description,
  StepperIndicator as Indicator
};

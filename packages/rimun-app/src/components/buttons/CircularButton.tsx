import { PhoneIcon } from "@heroicons/react/24/outline";

interface CircularButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon: typeof PhoneIcon;
}

const CircularButton: React.FC<CircularButtonProps> = ({ icon, ...props }) => {
  const Icon = icon;
  return (
    <button
      {...props}
      type="button"
      className={`w-8 h-8 flex justify-center items-center rounded-full bg-slate-200 bg-opacity-100 hover:bg-opacity-75 transition-opacity ${props.className}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default CircularButton;

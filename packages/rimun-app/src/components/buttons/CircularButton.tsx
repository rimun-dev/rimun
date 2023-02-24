import Icon, { IconName } from "../icons/Icon";

interface CircularButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon: IconName;
}

const CircularButton: React.FC<CircularButtonProps> = ({ icon, ...props }) => (
  <button
    {...props}
    type="button"
    className={`w-8 h-8 flex justify-center items-center rounded-full bg-slate-200 bg-opacity-50 hover:bg-opacity-75 transition-opacity ${props.className}`}
  >
    <Icon name={icon} className="h-4 w-4" />
  </button>
);

export default CircularButton;

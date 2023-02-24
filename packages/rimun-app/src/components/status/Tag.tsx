interface TagProps extends React.HTMLProps<HTMLSpanElement> {
  status: TagStatus;
}

export type TagStatus = "error" | "warn" | "info" | "success";

export default function Tag({ status, ...props }: TagProps) {
  let bgColor = "bg-blue-500";
  switch (status) {
    case "error": {
      bgColor = "bg-red-500";
      break;
    }
    case "success": {
      bgColor = "bg-green-500";
      break;
    }
    case "warn": {
      bgColor = "bg-amber-500";
      break;
    }
  }
  return (
    <span
      {...props}
      className={`inline-block uppercase text-xs font-semibold rounded-sm text-white px-1 ${bgColor} ${props.className}`}
    />
  );
}

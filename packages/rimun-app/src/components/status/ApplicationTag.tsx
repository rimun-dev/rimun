import Tag, { TagStatus } from "src/components/status/Tag";

interface ApplicationTagProps {
  children?: string;
}

export default function ApplicationTag(props: ApplicationTagProps) {
  let status: TagStatus = "warn";
  switch (props.children) {
    case "ACCEPTED":
      status = "success";
      break;
    case "REFUSED":
      status = "error";
      break;
  }

  return <Tag status={status}>{props.children}</Tag>;
}

import Tag, { TagStatus } from "src/components/status/Tag";

interface HousingTagProps {
  children?: string;
}

export default function HousingTag(props: HousingTagProps) {
  let status: TagStatus = "warn";
  switch (props.children) {
    case "ACCEPTED":
      status = "success";
      break;
    case "REFUSED":
      status = "error";
      break;
    case "NOT_REQUIRED":
      status = "info";
      break;
  }

  return <Tag status={status}>{props.children}</Tag>;
}

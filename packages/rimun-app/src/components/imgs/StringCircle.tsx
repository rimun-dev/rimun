import BaseCircle from "src/components/imgs/BaseCircle";

interface StringCircleProps {
  children: string;
}

export default function StringCircle(props: StringCircleProps) {
  return (
    <BaseCircle>
      <span className="text-xl text-brand">{props.children}</span>
    </BaseCircle>
  );
}

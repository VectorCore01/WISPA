import BecomePro from "./BecomePro.jsx";
import CreateHive from "./CreateHive.jsx";
import HiveChannel from "./HiveChannel.jsx";

export default function HiveTab(props) {
  const { isPro, hiveCfg } = props;
  if (!isPro) return <BecomePro {...props} />;
  if (!hiveCfg) return <CreateHive {...props} />;
  return <HiveChannel {...props} />;
}

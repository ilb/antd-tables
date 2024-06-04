import { Button } from "antd";
import RestoreIcon from "../icons/RestoreIcon.js";
import ArchiveIcon from "../icons/ArchiveIcon.js";

/**
 * @param record
 * @param onRestore
 * @param onArchive
 * @param props
 * @constructor
 */
export default function IsArchiveToggle({ isArchive, onRestore, onArchive, ...props }) {
  const IconComponent = ({ type, handler }) => {
    let icon = "Тут могла быть ваша реклама.";

    if (type === "restore") {
      icon = <RestoreIcon />;
    }

    if (type === "archive") {
      icon = <ArchiveIcon />;
    }

    return (
      <Button
        className={`archive-button archive-${type}-button`}
        size="small"
        onClick={handler}
        type="primary"
        shape="circle"
        icon={icon}
      />
    );
  };

  return (
    <span {...props}>
      <IconComponent type={isArchive ? "restore" : "archive"} handler={isArchive ? onRestore : onArchive} />
    </span>
  );
}

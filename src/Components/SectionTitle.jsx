import React from "react";

const SectionTitle = ({ icon: Icon, title }) => {
  return (
    <h3 className="section-title">
      {Icon && <Icon size={20} />} {title}
    </h3>
  );
};

export default SectionTitle;

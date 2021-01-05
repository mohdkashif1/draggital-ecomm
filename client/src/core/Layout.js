import React from "react";
import Menu from "./Menu";
import '../styles.css';


function Layout({title="Title",description="Description",className,children}){
  return <div>
  <Menu />
 <div className="jumbotron bg-light">
  <h2>{title}</h2>
  <p className="lead">{description}</p>
  </div>
  <div className={className}>{children}</div>
 </div>
}

export default Layout;

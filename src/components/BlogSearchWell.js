import React from "react";

export default function BlogSearchWell() {
  return(
    <div className="well">
        <h4>Blog Search</h4>
        <div className="input-group">
            <input type="text" className="form-control" />
            <span className="input-group-btn">
                <button className="btn btn-default" type="button"><i className="fa fa-search"></i></button>
            </span>
        </div>
    </div>
  );
}

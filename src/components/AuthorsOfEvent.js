import React from 'react';

class AuthorsOfDate extends React.Component {
  render() {

    const { authors, correctPlacementArray } = this.props;

    if(authors !== undefined && correctPlacementArray === "event"){
      return(

        authors.map(author => <span className="eventAuthor"><i className="far fa-user"></i> {author.post_title}</span> )


      )
    }
    else{
      return "";
    }


  }
}

export default AuthorsOfDate;
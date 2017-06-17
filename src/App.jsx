import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Link,
} from 'react-router-dom';

import Loading from './Loading';


const axios = require('axios');

const rootURL = 'https://fcctop100.herokuapp.com/api/fccusers/top/'

const SetSort = (props) => {
        return(
          <div>
            <table className='camper__grid'>
              <thead>
                <tr>
                  <th className='sm'>#</th>
                  <th className='lg'>Camper Name</th>
                  <th className='md'>
                    <button
                       className={props.sort === 'recent' ? "active": "inactive"}
                       onClick={e => props.onClick(e)}
                       name='recent'>
                       Recent points
                    </button>
                  </th>
                  <th className='md'>
                    <button
                       className={props.sort === 'alltime' ? "active": "inactive"}
                       onClick={e => props.onClick(e)}
                       name='alltime'>
                       All-time points
                    </button>
                  </th>
                  </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
      )
}

const CamperList = (props) => {
  return (
    <table className='camper__grid'>
      <tbody>
        {props.campers.map((camper, index) => {
        return (
          <tr className='camper__row' key={camper.username}>
            <td className='camper__rank sm'>{index+1}</td>
            <td className='camper__avatar lg'>
              <img
               className='camper__img'
               src={camper.img}
               alt={'Avatar for '+ camper.username}
               />&nbsp;
              <a href={'https://www.freecodecamp.com/' + camper.username}>{camper.username}</a>
            </td>
            <td className='camper__points md'>{camper.recent}</td>
            <td className='camper__points md'>{camper.alltime}</td>
          </tr>
        )
    })}
      </tbody>
    </table>
)
}

CamperList.propTypes = {
    campers: PropTypes.array.isRequired
}


SetSort.propTypes = {
    sort: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: 'alltime',
      campers: null
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getCampers(this.state.sort);
  }

  getCampers (sort) {
  return axios.get(rootURL + sort)
    .then(function(campers){
      this.setState({
            campers: campers.data
            })
  }.bind(this))
    .catch(this.handleError)
  }

  handleError (error) {
    console.warn(error);
    return null;
  }

  handleClick(e){
    let sort = e.target.name;
    this.setState({
          sort
        });
    this.getCampers(sort);
  }

  render() {
    return (
        <main>
          <h1>Camper Leaderboard</h1>
          <SetSort
            sort={this.state.sort}
            onClick={this.handleClick}
            />
          {!this.state.campers
            ? <Loading />
            : <CamperList campers={this.state.campers} />
        }
        </main>
    );
  }
}

export default App;
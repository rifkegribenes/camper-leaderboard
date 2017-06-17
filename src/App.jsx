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
  console.log('17 props', props)
        return(
          <div>
         <button
             className={props.sort === 'alltime' ? "active": "inactive"}
             onClick={e => props.onClick(e)}
             name='alltime'
             value='Sort by all-time points'>
        </button>
        <button
             className={props.sort === 'recent' ? "active": "inactive"}
             onClick={e => props.onClick(e)}
             name='recent'
             value='Sort by recent points'>
        </button>
        </div>
      )
}

const CamperList = (props) => {
  console.log('36 props',props);
  return (
    <table className='camper__grid'>
    <thead>
      <tr>
        <th>#</th>
        <th>Camper Name</th>
        <th>
          Points in Last 30 Days</th>
        <th>
          All Time Points</th>
        </tr>
    </thead>
      <tbody>
        {props.campers.map((camper, index) => {
        return (
          <tr className='camper__row' key={camper.username}>
            <td className='camper__rank'>{index+1}</td>
            <td className='camper__avatar'>
              <img
               className='camper__img'
               src={camper.img}
               alt={'Avatar for '+ camper.username}
               />&nbsp;
              <a href={'https://www.freecodecamp.com/' + camper.username}>{camper.username}</a>
            </td>
            <td className='camper__points'>{camper.recent}</td>
            <td className='camper__points'>{camper.alltime}</td>
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
    const sort = this.state.sort;
    this.getCampers(sort);
    console.log('75', this.state);
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
    console.log('100', sort);
    this.getCampers(this.state.sort)
        .then(function(campers){
            this.setState({
            campers: campers.data
            })
        }.bind(this))
        .catch(this.handleError)
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
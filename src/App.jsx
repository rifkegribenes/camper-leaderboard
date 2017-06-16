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
         <span
             className={props.sort === 'alltime' ? "active": null}
             onClick={e => props.handleClick(e)}
             name='alltime'>
             All Time Points
        </span>
        <span
             className={props.sort === 'recent' ? "active": null}
             onClick={e => props.handleClick(e)}
             name='recent'>
             Points in Last 30 Days
        </span>
        </div>
      )
}

const CamperList = (props) => {
  console.log('36',this.props);
  return (
    <table className='grid'>
      <tbody>
        {props.campers.map((camper, index) => {
        return (
          <tr className='camper' key={camper.username}>
            <td className='camper__rank'>#{index+1}</td>
            <td className='camper__avatar'>
              <img
               className='camper__img'
               src={camper.img}
               alt={'Avatar for '+ camper.username}
               />
            </td>
            <td className='camper__name'>
              <a href={camper.url}>{camper.username}</a>
            </td>
            <td className='camper__points--recent'>{camper.recent}</td>
            <td className='camper__points--alltime'>{camper.alltime}</td>
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
    this.getCampers(sort)
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
    this.setState({
          sort: e.target.name
        });
    getCampers(this.state.sort)
        .then(function(campers){
            this.setState(function() {
                return {
                    campers
                }
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
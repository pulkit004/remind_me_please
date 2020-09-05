import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ReminderList.css';

class ReminderList extends Component {
    render() {
        return (
            <div className='ReminderList'>
               <div className="header">
                   <div>
                       This saturday
                   </div>
                   <div>
                       Add new
                   </div>
               </div>
            </div>
        );
    }
}

ReminderList.propTypes = {

};

export default ReminderList;
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './DatePicker.css';
import ReminderList from '../ReminderList/ReminderList';
import Locker from 'lockr';
import {Tooltip} from 'antd'

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);
let inputRef = React.createRef();

export default class MyDatePicker extends Component {

  /**
   *  Core
   */

  daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthMap = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];

  constructor() {
    super();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    this.state = {
      getMonthDetails: [],
      year,
      month,
      selectedDay: todayTimestamp,
      monthDetails: this.getMonthDetails(year, month),
      reminderList: Locker.get('reminderList') || [],
    };
  }
  updateCalender = () => this.setState({
          reminderList: Locker.get('reminderList')
  })

  componentDidMount() {
    window.addEventListener('click', this.addBackDrop);
    this.setDateToInput(this.state.selectedDay);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.addBackDrop);
  }

  addBackDrop = e => {
    if (this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
      this.showDatePicker(false);
    }
  };

  showDatePicker = (showDatePicker = true) => {
    this.setState({showDatePicker});
  };

  getDayDetails = args => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = this.getNumberOfDays(prevYear, prevMonth);
    let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date, day, month, timestamp, dayString: this.daysMap[day],
    };
  };

  getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  };

  getMonthDetails = (year, month) => {
    let firstDay = (new Date(year, month)).getDay();
    let numberOfDays = this.getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 6;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index, numberOfDays, firstDay, year, month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  };

  isCurrentDay = day => {
    return day.timestamp === todayTimestamp;
  };

  isSelectedDay = day => {
    return day.timestamp === this.state.selectedDay;
  };

  getDateFromDateString = dateValue => {
    let dateData = dateValue.split('-').map(d => parseInt(d, 10));
    if (dateData.length < 3) return null;

    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return {year, month, date};
  };

  getMonthStr = month => this.monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

  getDateStringFromTimestamp = timestamp => {
    let dateObject = new Date(timestamp);
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
  };

  setDate = dateData => {
    let selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();
    this.setState({selectedDay});
    if (this.props.onChange) {
      this.props.onChange(selectedDay);
    }
  };

  updateDateFromInput = () => {
    let dateValue = inputRef.current.value;
    let dateData = this.getDateFromDateString(dateValue);
    if (dateData !== null) {
      this.setDate(dateData);
      this.setState({
        year: dateData.year,
        month: dateData.month - 1,
        monthDetails: this.getMonthDetails(dateData.year, dateData.month - 1),
      });
    }
  };

  setDateToInput = (timestamp) => {
    let dateString = this.getDateStringFromTimestamp(timestamp);
    inputRef.current.value = dateString;
  };

  onDateClick = day => {
    this.setState({selectedDay: day.timestamp}, () => this.setDateToInput(day.timestamp));
    if (this.props.onChange) {
      this.props.onChange(day.timestamp);
    }
  };

  setYear = offset => {
    let year = this.state.year + offset;
    let month = this.state.month;
    this.setState({
      year, monthDetails: this.getMonthDetails(year, month),
    });
  };

  setMonth = offset => {
    let year = this.state.year;
    let month = this.state.month + offset;
    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    this.setState({
      year, month, monthDetails: this.getMonthDetails(year, month),
    });
  };

  renderCalendar() {
    let days = this.state.monthDetails.map((day, index) => {
      return (<>
        <div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') + (this.isCurrentDay(day) ? ' highlight' : '') + (this.isSelectedDay(day) ? ' highlight-green' : '')} key={index}>
          <div className='cdc-day'>
            <span className={'active'} onClick={() => this.onDateClick(day)}>
                {day.date}

            </span>
            <br />
             <p>
               {this.state.reminderList.find(it => it.selectedDate === day.timestamp)?.items?.length > 0 && <Tooltip style={{background: 'transparent', color: '#000'}} title={<div>
                 {this.state.reminderList.find(it => it.selectedDate === day.timestamp)?.items?.map(it =>  <div className={'mb-2'}>
                   <p>
                     {it?.item}
                   </p>
                   <p className={'d-flex flex-row align-items-center'}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin" width="13" height="13" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                       <path stroke="none" d="M0 0h24v24H0z" />
                       <circle cx="12" cy="11" r="3" />
                       <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                     </svg>
                     <div className="px-1"/>
                     {it?.location}
                   </p>
                   <p className={'d-flex flex-row align-items-center'}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin" width="13" height="13" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                       <path stroke="none" d="M0 0h24v24H0z" />
                       <circle cx="12" cy="12" r="9" />
                       <polyline points="12 7 12 12 15 15" />
                     </svg>
                     <div className="px-1"/>

                     {it?.time}
                   </p>
                 </div>)}
               </div>}>
                 <span style={{background: 'transparent', color: '#222'}}>
                                    {this.state.reminderList.find(it => it.selectedDate === day.timestamp) ? '...' : ''}

                 </span>
               </Tooltip>}
             </p>

          </div>

        </div>

      </>);
    });

    return (<div className='c-container'>
      <div className='cc-head'>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, i) => <div key={i} className='cch-name'>{d}</div>)}
      </div>
      <div className='cc-body'>
        {days}
      </div>
    </div>);
  }

  render() {
    return (<div className='MyDatePicker'>
      <div className='mdp-input' onClick={() => this.showDatePicker(true)}>
        <input type='date' onChange={this.updateDateFromInput} ref={inputRef} />
      </div>
      <div className='mdp-container'>
        <div className='mdpc-head'>
          <div className='mdpch-button'>
            <div className='mdpchb-inner' onClick={() => this.setYear(-1)}>
              <span className='mdpchbi-left-arrows' />
            </div>
          </div>
          <div className='mdpch-button'>
            <div className='mdpchb-inner' onClick={() => this.setMonth(-1)}>
              <span className='mdpchbi-left-arrow' />
            </div>
          </div>
          <div className='mdpch-container'>
            <div className='mdpchc-year'>{this.state.year}</div>
            <div className='mdpchc-month'>{this.getMonthStr(this.state.month)}</div>
          </div>
          <div className='mdpch-button'>
            <div className='mdpchb-inner' onClick={() => this.setMonth(1)}>
              <span className='mdpchbi-right-arrow' />
            </div>
          </div>
          <div className='mdpch-button' onClick={() => this.setYear(1)}>
            <div className='mdpchb-inner'>
              <span className='mdpchbi-right-arrows' />
            </div>
          </div>
        </div>
        <div className='mdpc-body'>
          {this.renderCalendar()}

        </div>

      </div>
      <ReminderList updateCalender={this.updateCalender} selectedDate={this.state.selectedDay} />


    </div>);
  }

}

import React, {Component} from 'react';
import './ReminderList.css';
import {Button, Input, Modal} from 'antd';
import Locker from 'lockr';
import dayjs from 'dayjs';

class ReminderList extends Component {

  constructor(props) {
    super(props);
    const reminderList = Locker.get('reminderList');
    this.state = {
      visible: false, item: '', reminderList: reminderList || [],
    };
  }

  change = (event, name) => {
    const {state} = this;
    state[name] = event.target.value;
    this.setState({
      state,
    });
  };

  add = () => {
    const {item, location, time, reminderList} = this.state;
    const {selectedDate} = this.props;
    let reminderListItems = []
    let computedObject = {}

    if(reminderList?.find(it => it.selectedDate === selectedDate)){
      let existingObject = reminderList?.find(it => it.selectedDate === selectedDate)
      existingObject.items.unshift({item,location, time})

    } else {
      computedObject.selectedDate = selectedDate
      reminderListItems.unshift({item, location, time})
      computedObject.items = reminderListItems
      reminderList.push(computedObject)
    }
    Locker.set('reminderList', reminderList);
    this.setState({reminderList});
  };

  render() {
    const {visible, item, reminderList, location, time} = this.state;

    return (<div className='ReminderList'>
      <Modal
          title="Add new item to remember"
          visible={visible}
          centered
          footer={null}

          onCancel={() => this.setState({visible: false})}
      >
        <div>
          <span>Item</span>
          <Input name={'item'} value={item} onChange={(e) => this.change(e, 'item')} placeholder="Meet Kunal at Bangalore HQ" />

          <div className="my-2" />
          <span>Location</span>

          <Input name={'location'} value={location} onChange={(e) => this.change(e, 'location')} placeholder="Bangalore HQ" />
          <div className="my-2" />

          <span>Time</span>

          <Input name={'time'} value={time} onChange={(e) => this.change(e, 'time')} placeholder="11" />
          <div className="my-2" />

          <Button type={'primary'} onClick={this.add}>Add</Button>
        </div>
      </Modal>
      <div className="header">
        <div>

        </div>
        <div>
               <span className={'cursor-pointer d-flex flex-row align-items-center  '} onClick={() => this.setState({visible: true})}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin" width="15" height="15" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" />
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
</svg>
                 <div className="px-1" />
                 Add new
               </span>
        </div>
      </div>

      <div className="list-body">
        <ul>
          {reminderList?.sort((a,b) => b.selectedDate-a.selectedDate).map((it, index) => <li key={it?.name + `${index}`} className={'mb-2'}>
            <p className={'lead'}>
              {dayjs(it?.selectedDate).format('DD MMM')}
            </p>
            {
              it?.items?.map(it => <div>
                <p>
                  {it?.name}
                </p>
                <p className={'d-flex flex-row align-items-center'}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin" width="15" height="15" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="12" cy="11" r="3" />
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1 -2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                  </svg>
                  <div className="px-1"/>
                  {it?.location}
                </p>
                <p className={'d-flex flex-row align-items-center'}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-map-pin" width="15" height="15" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFF" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 15" />
                  </svg>
                  <div className="px-1"/>

                  {it?.time}
                </p>
              </div>)
            }
          </li>)}
        </ul>
      </div>
    </div>);
  }
}

ReminderList.propTypes = {};

export default ReminderList;
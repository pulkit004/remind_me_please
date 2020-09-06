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

    if(reminderList?.find(it => it.selectedDate === selectedDate)){
      let existingObject = reminderList?.find(it => it.selectedDate === selectedDate)
    }
    reminderList.push({item, selectedDate, location, time});
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
               <span className={'cursor-pointer'} onClick={() => this.setState({visible: true})}>
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
            <p>
              {it?.item}
            </p>
            <p>
              {it?.location}
            </p>

            <p>
              {it?.time}
            </p>
          </li>)}
        </ul>
      </div>
    </div>);
  }
}

ReminderList.propTypes = {};

export default ReminderList;
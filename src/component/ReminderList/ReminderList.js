import React, {Component} from 'react';
import './ReminderList.css';
import {Button, Input, Modal} from 'antd';
import Locker from 'lockr'
import dayjs from 'dayjs';
class ReminderList extends Component {


  constructor(props) {
    super(props);
    const reminderList = Locker.get('reminderList')
    this.state = {
      visible: false,
      item: '',
      reminderList: reminderList || []
    };
  }

  change = (event) => {
    const value = event.target.value
    this.setState({
      item: value
    })
  }

  add = () => {
      const {item, reminderList} = this.state;
      const {selectedDate} = this.props
      reminderList.unshift({item, selectedDate})
      Locker.set('reminderList', reminderList)
      this.setState({reminderList})
  };

  render() {
    const {visible, item, reminderList} = this.state;

    return (<div className='ReminderList'>
          <Modal
              title="Add new item to remember"
              visible={visible}
              centered
              footer={null}

              onCancel={() => this.setState({visible: false})}
          >
            <div className={'form-inline'}>
              <Input name={'item'} value={item} onChange={this.change} placeholder="Meet Kunal at Bangalore HQ" />
              <div className="px-1" />
              <Button type={'primary'} onClick={this.add}>Add</Button>
            </div>
          </Modal>
          <div className="header">
            <div>
              This saturday
            </div>
            <div>
               <span className={'cursor-pointer'} onClick={() => this.setState({visible: true})}>
                   Add new
               </span>
            </div>
          </div>

          <div className="list-body">
            <ul>
              {
                reminderList?.map(it => <li className={'mb-2'}>
                 <p>
                   {it?.item}
                 </p>
                  <p>
                    {dayjs.unix(it?.selectedDate).format('DD MMM')}

                  </p>
                </li> )
              }
            </ul>
          </div>
        </div>);
  }
}

ReminderList.propTypes = {};

export default ReminderList;
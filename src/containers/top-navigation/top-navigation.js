/**
 * Created by Administrator on 2016-10-09.
 */
import React  from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { Menu, Icon,Row, Col } from 'antd';
import styles from './index.css';

class TopNaviGation extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            current: 'mail',
        }
    }

    handleClick(e) {
        //console.log("e:",e);
        this.setState({
            current: e.key,
        });
    }

    render() {
        const {menuData, navpath} = this.props;
        //console.log("menuData:",menuData);
        let selectNaviOne = {};
        for(var i=0;i<menuData.length;i++){
            if(navpath == menuData[i].id){
                selectNaviOne = menuData[i];
            }
        }
        const topMenu = (selectNaviOne) => {
            if(selectNaviOne.subMenu.length == 0){
                return null;
            }else {
                let topMenuData = selectNaviOne.subMenu;
                topMenuData.map(( itemTop ) => {
                    //console.log("itemTop:",itemTop);
                    return (
                        <Menu.Item key={'menu' + itemTop.id}>
                            <Link to={itemTop.link}>{itemTop.name}</Link>
                        </Menu.Item>
                    )
                })
            }
        };
        return (
            <div>
                <Menu mode="horizontal" onClick={this.handleClick.bind(this)}>
                    {topMenu}
                </Menu>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        menuData:state.menu.items,
        navpath: state.menu.navpath,
    }
}

export default connect(mapStateToProps)(TopNaviGation);
/**
 * Created by Administrator on 2016-10-10.
 */
import React  from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import { Menu, Icon,Row, Col } from 'antd';

class TopSecondNavi extends React.Component{
    constructor(props) {
        super(props);
    }
    handleClick(e) {
        console.log("e:",e);
        this.setState({
            current: e.key,
        });
    }

    render() {
        const {topNavi} = this.props;
        const topSecondMenu = (topNavi) => {
            if(topNavi.subMenu.length == 0){
                return null;
            }else {
                let topSecondMenuData = topNavi.subMenu;
                topSecondMenuData.map(( itemTopSec ) => {
                    //console.log("itemTopSec:",itemTopSec);
                    return (
                        <Link to={itemTopSec.link}>{itemTopSec.name}</Link>
                        /*<Menu.Item key={'menu' + itemTopSec.id}>
                            <Link to={itemTopSec.link}>{itemTopSec.name}</Link>
                        </Menu.Item>*/
                    )
                })
            }
        }

        return (
            <div>
                {topSecondMenu}
                {/*<Menu mode="horizontal" onClick={this.handleClick.bind(this)}>
                    {topSecondMenu}
                </Menu>*/}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        topNavi:state.getTopNaviInfo.TopNavi,
    }
}

export default connect(mapStateToProps)(TopSecondNavi);
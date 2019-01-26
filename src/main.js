import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'

import {
    Field, CellGroup, Collapse, CollapseItem, NavBar, card, Icon, Cell, Row, Col, Swipe, SwipeItem, Tag, Dialog, Toast
}
from 'vant'
import { Select, Option, Radio, RadioGroup, radioButton, Switch, Input, Button, Checkbox } from 'element-ui';

Vue.use(Field).use(Dialog).use(Tag).use(Toast).use(CellGroup).use(Icon).use(Collapse).use(CollapseItem).use(NavBar).use(card).use(Cell).use(Row).use(Col).use(Swipe).use(SwipeItem)
Vue.use(Select).use(Option).use(RadioGroup).use(radioButton).use(Switch).use(Input).use(Radio).use(Button).use(Checkbox)

fastclick.attach(document.body)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

<template>
    <q-tabs class="row justify" >

        <q-tab default slot="title" name="tab-1" icon="message" label="未结账"/>
        <q-tab slot="title" name="tab-2" icon="fingerprint" label="已结账" @click="showCompleteOrder()"/>

        <!-- Targets -->
        <q-tab-pane name="tab-1">
            <q-list highlight inset-separator>
                
                <q-item multiline link v-for="(order, index) in incompleteOrderList" v-bind:key="index">
                    <q-item-side>{{ index+1 }}.</q-item-side>
                    <q-item-main
                        :label="order.seatName"
                        label-lines="1"
                        :sublabel="order.numberOfDiners + '人'"
                        sublabel-lines="1"
                    />
                    <q-item-side right>
                        <q-item-tile stamp>{{ getTimeFrom(order.createdDate) }}</q-item-tile>
                        <q-item-tile>{{ order.totalPrice }} 元</q-item-tile>
                        <q-item-tile>
                            <q-btn label="结账" color="primary" @click="showDetails(index)"></q-btn>
                        </q-item-tile>
                    </q-item-side>
                </q-item>
            </q-list>
        </q-tab-pane>
        <q-tab-pane name="tab-2">
            <q-list highlight inset-separator>
                <q-item multiline link v-for="(order, index) in completeOrderList" v-bind:key="index">
                    <q-item-side>{{ index+1 }}.</q-item-side>
                    <q-item-main
                        :label="order.seatName"
                        label-lines="1"
                        :sublabel="order.numberOfDiners + '人'"
                        sublabel-lines="1"
                    />
                    <q-item-side right>
                        <q-item-tile stamp>{{ getTimeFrom(order.createdDate) }}</q-item-tile>
                        <q-item-tile>{{ order.totalPrice }} 元</q-item-tile>
                    </q-item-side>
                </q-item>
            </q-list>
        </q-tab-pane>

    </q-tabs>
</template>

<script>
export default {
    data(){
        return {
            incompleteOrderList: [],
            completeOrderList: []
        }
    },
    mounted() {
        this.axios.get('/order',{
            params: {
                checkout: false
            }
        })
            .then(res => {
                console.log(res)
                this.incompleteOrderList = res.data.content
            })
            .catch(err => {
                console.log(res)
            })
    },
    methods: {
        getTimeFrom(createdDate){
            var secondsAgo = ((new Date()).getTime()  - (new Date(createdDate)).getTime())/1000
            var dayDiff = Math.floor(secondsAgo/(24*3600))
            if(dayDiff>0){
                return "一天之前"
            }

            var leave1 = secondsAgo%(24*3600)
            var hoursDiff = Math.floor(leave1/3600)

            var leave2 = leave1%(3600)
            var minutesDiff = Math.floor(leave2/60)

            var secondsDiff = Math.floor(leave2%60)
            return hoursDiff+'小时'+minutesDiff+'分钟'+secondsDiff+'秒之前'
        },
        showDetails(index){
            console.log(index)
            var order = this.incompleteOrderList[index]
            order.checkout = true
            this.axios.post('/order', order)
                .then(res => {
                    console.log(res)
                    this.incompleteOrderList.pop(index)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        showCompleteOrder(){
            this.axios.get('/order', {
                params: {
                    checkout: true
                }
            })
                .then(res => {
                    console.log(res)
                    this.completeOrderList = res.data.content
                })
                .catch(err => {
                    console.log(res)
                })
        }
    },
}
</script>


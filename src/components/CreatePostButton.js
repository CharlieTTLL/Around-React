import React from 'react';
import { WrappedApp } from "./CreatePostForm"
import { Modal, Button, message } from 'antd';
import $ from 'jquery';
import { API_ROOT, POS_KEY, TOKEN_KEY, AUTH_PREFIX } from '../constants';

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });
                console.log("receive form values:", values);
                const formData = new FormData();
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                //const lat = 34.8565647, lon = -74.0967357;
                formData.set('lat', lat + Math.random() * 0.1 - 0.05);
                formData.set('lon', lon + Math.random() * 0.1 - 0.05);
                formData.set('message', values.message);
                formData.set('image', values.image[0]);
                $.ajax({
                    url: `${API_ROOT}/post`,
                    method: 'POST',
                    data: formData,
                    headers: {
                        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
                    },
                    processData: false,
                    contentType: false,
                    dataType: 'text',
                }).then(() => {
                    message.success("created a post successful");
                    this.form.resetFields();
                    this.props.loadNearbyPosts().then(() => {
                        this.setState( { visible: false, confirmLoading: false} );
                    });
                }, (response) => {
                    console.log(response.responseText);
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
            confirmLoading: false
        });
    }
    refHandle = (form) => {
        console.log(form);
        this.form = form;
    }
    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Posts</Button>
                <Modal title="Title"
                       visible={visible}
                       onOk={this.handleOk}
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                >
                    {/*在对WrappedApp时候，当这个组建被挂载后创建实例后，ref设置的回调函数立刻执行，回调函数的参数就是该组件的具体实例*/}
                    <WrappedApp ref={this.refHandle}/>
                </Modal>
            </div>
        );
    }
}
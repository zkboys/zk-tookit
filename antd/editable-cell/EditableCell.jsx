import React, {Component, PropTypes} from 'react';
import {Icon, Input, Form} from 'antd';
import './style.less';

const FormItem = Form.Item;

class EditableCell extends Component {
    static defaultProps = {
        type: 'input', // TODO number textarea password mobile email select select-tree checkbox radio switch
        field: '',
        value: '',
        rules: [],
        onChange: () => {
        },
    }
    static propTypes = {
        type: PropTypes.string,
        field: PropTypes.string.isRequired,
        rules: PropTypes.array,
    };
    state = {
        value: this.props.value,
        editable: false,
    }
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({value});
    }
    edit = () => {
        this.setState({editable: true});
        setTimeout(() => {
            this.input.focus();
            this.input.refs.input.select();
        }, 0);
    }
    handleSubmit = () => {
        const {form, onChange, field} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({editable: false});
                onChange(values[field]);
            }
        });
    }

    render() {
        const {editable} = this.state;
        const {form: {getFieldDecorator}, field, rules, value} = this.props;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem>
                                    {getFieldDecorator(field, {
                                        initialValue: value,
                                        rules,
                                    })(
                                        <Input ref={node => this.input = node}/>
                                    )}
                                </FormItem>
                            </Form>
                            <Icon
                                type="check"
                                className="editable-cell-icon-check"
                                onClick={this.handleSubmit}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            {value || ' '}
                            <Icon
                                type="edit"
                                className="editable-cell-icon"
                                onClick={this.edit}
                            />
                        </div>
                }
            </div>
        );
    }
}

export default Form.create()(EditableCell);

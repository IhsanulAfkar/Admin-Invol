import { useState, useEffect } from 'react'
import { Row, Card, CardTitle, FormGroup, Button, CardText } from 'reactstrap'
// import { NavLink } from 'react-router-dom'
import { Colxx } from 'components/common/CustomBootstrap'
import IntlMessages from 'helpers/IntlMessages'
import { getCurrentColor } from 'helpers/Utils'
import jwt from 'jwt-decode'
import Cookies from 'js-cookie'
import { API_ENDPOINT } from 'config/api'
import { Redirect } from 'react-router-dom'
import http from 'helpers/http'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirectToRoute, setRedirectToRoute] = useState(false)

  useEffect(() => {
    getCurrentColor()
  }, [])

  // const color = getCurrentColor()

  if (redirectToRoute) {
    return <Redirect to="/app/dashboard" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      email: email,
      password: password,
    }

    await http
      .post(API_ENDPOINT.LOGIN, data)
      .then((res) => {
        if (res.status === 200) {
          const token = res.data.token
          const decode = jwt(token)
          const exp = decode.exp * 1000

          Cookies.set('token', token)
          Cookies.set('expireAt', new Date(exp))

          setRedirectToRoute(true)
        }
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card
          className="auth-card"
          style={{ borderRadius: '15px', padding: '0' }}
        >
          <div
            className="form-side"
          >
            <CardTitle className="mb-1">
              <IntlMessages id="user.login-title" />
            </CardTitle>
            <CardText>
              <IntlMessages id="user.login-description" />
            </CardText>
            <form
              // className="av-tooltip tooltip-label-bottom"
              onSubmit={handleSubmit}
            >
              <FormGroup className="form-group">
                {/* <Label>
                  <IntlMessages id="user.email" />
                </Label> */}
                <input
                  className="login-input"
                  placeholder="Email"
                  name="email"
                  type="text"
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />
              </FormGroup>
              <FormGroup className="form-group">
                {/* <Label>
                  <IntlMessages id="user.password" />
                </Label> */}
                <input
                  className="login-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="true"
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                />
              </FormGroup>
              <div className="d-flex align-items-center">
                <Button
                  color="primary"
                  className={`btn-shadow btn-multiple-state`}
                  style={{
                    width: '300px',
                    height: '60px',
                    borderRadius: '0.75rem',
                  }}
                >
                  <span className="spinner d-inline-block">
                    <span className="bounce1" />
                    <span className="bounce2" />
                    <span className="bounce3" />
                  </span>
                  <span className="label">
                    <IntlMessages id="user.login-button" />
                  </span>
                </Button>
              </div>
            </form>
          </div>
          <div
            className="position-relative image-side"
            style={{ borderRadius: '0 15px 15px 0' }}
          ></div>
        </Card>
      </Colxx>
    </Row>
  )
}

export default Login

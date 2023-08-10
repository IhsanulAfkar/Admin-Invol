import { useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import { getCurrentColor } from 'helpers/Utils'
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  searchPath,
  isDarkSwitchActive,
  adminRoot,
} from 'constants/defaultValues'
import { MobileMenuIcon, MenuIcon } from 'components/svg'
import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
} from 'redux/actions'

import { API_ENDPOINT, API_URL } from 'config/api'
import axios from 'axios'
import Cookies from 'js-cookie'
import TopnavDarkSwitch from './Topnav.DarkSwitch'
import http from 'helpers/http'

const TopNav = ({
  history,
  containerClassnames,
  menuClickCount,
  selectedMenuHasSubItems,
  setContainerClassnamesAction,
  clickOnMobileMenuAction,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [userData, setUserData] = useState()

  const search = () => {
    history.push(`${searchPath}?key=${searchKeyword}`)
    setSearchKeyword('')
  }

  useEffect(() => {
    const getDataUser = () => {
      http.get(API_ENDPOINT.GET_LOGIN_USER_DATA).then((res) => {
        const data = res.data.user
        localStorage.setItem('user', JSON.stringify(data))
        setUserData(data)
      })
    }

    if (!userData) {
      const localUserData = localStorage.getItem('user')

      if (!localUserData) {
        getDataUser()
        return
      }

      setUserData(JSON.parse(localUserData))
    }

    getCurrentColor()
  }, [userData])

  // const color = getCurrentColor()

  const handleDocumentClickSearch = (e) => {
    let isSearchClick = false
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('navbar') ||
        e.target.classList.contains('simple-icon-magnifier'))
    ) {
      isSearchClick = true
      if (e.target.classList.contains('simple-icon-magnifier')) {
        search()
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains('search')
    ) {
      isSearchClick = true
    }

    if (!isSearchClick) {
      const input = document.querySelector('.mobile-view')
      if (input && input.classList) input.classList.remove('mobile-view')
      removeEventsSearch()
      setSearchKeyword('')
    }
  }

  const removeEventsSearch = () => {
    document.removeEventListener('click', handleDocumentClickSearch, true)
  }

  const handleLogout = () => {
    const inputToken = Cookies.get('token')

    try {
      axios
        .post(`${API_URL}/api/auth/logout`, {
          headers: {
            Authorization: `Bearer ${inputToken}`,
          },
        })
        .then((res) => res)
        .catch((err) => err)
    } catch (err) {
      console.log(err)
    }
    Cookies.remove('token')
    Cookies.remove('expireAt')
    Cookies.remove('_id')
    window.localStorage.clear()
    window.location.href = '/'
  }

  const menuButtonClick = (e, _clickCount, _conClassnames) => {
    e.preventDefault()

    setTimeout(() => {
      const event = document.createEvent('HTMLEvents')
      event.initEvent('resize', false, false)
      window.dispatchEvent(event)
    }, 350)
    setContainerClassnamesAction(
      _clickCount + 1,
      _conClassnames,
      selectedMenuHasSubItems
    )
  }

  const mobileMenuButtonClick = (e, _containerClassnames) => {
    e.preventDefault()
    clickOnMobileMenuAction(_containerClassnames)
  }

  return (
    <nav className="navbar fixed-top">
      <div className="d-flex align-items-center navbar-left">
        <NavLink
          to="#"
          location={{}}
          className="menu-button d-none d-md-block"
          onClick={(e) =>
            menuButtonClick(e, menuClickCount, containerClassnames)
          }
        >
          <MenuIcon />
        </NavLink>
        <NavLink
          to="#"
          location={{}}
          className="menu-button-mobile d-xs-block d-sm-block d-md-none"
          onClick={(e) => mobileMenuButtonClick(e, containerClassnames)}
        >
          <MobileMenuIcon />
        </NavLink>
      </div>
      {/* LOGO */}
      <NavLink
        className="navbar-logo"
        to={adminRoot}
        style={{ width: '100%', maxWidth: '141px' }}
      >
        <svg
          width="193"
          height="32"
          viewBox="0 0 193 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.9"
            d="M26.1819 13.2289H26.5216C27.1728 12.1814 28.0505 11.3603 29.1547 10.7658C30.2588 10.1429 31.5187 9.83146 32.9344 9.83146C34.2367 9.83146 35.3833 10.0438 36.3743 10.4685C37.3652 10.8932 38.1721 11.5019 38.795 12.2946C39.4462 13.0591 39.9275 13.9934 40.2389 15.0975C40.5787 16.1734 40.7485 17.3767 40.7485 18.7074V31.3205H35.1852V19.3869C35.1852 17.8863 34.8454 16.7821 34.1659 16.0743C33.5147 15.3382 32.5521 14.9701 31.2781 14.9701C30.5137 14.9701 29.8342 15.14 29.2396 15.4798C28.6733 15.7912 28.1779 16.23 27.7532 16.7963C27.3568 17.3342 27.0454 17.9854 26.8189 18.7498C26.6207 19.486 26.5216 20.2787 26.5216 21.1281V31.3205H20.9583V10.511H26.1819V13.2289ZM42.3066 10.511H48.6344L53.8156 23.7611H54.1128L59.3365 10.511H65.6218L56.6609 31.3205H51.1825L42.3066 10.511ZM77.385 9.83146C78.9988 9.83146 80.4714 10.1146 81.8017 10.6808C83.1607 11.2187 84.3217 11.9832 85.2841 12.9741C86.2753 13.9367 87.0397 15.0975 87.5774 16.4565C88.1439 17.8155 88.4268 19.3019 88.4268 20.9157C88.4268 22.5295 88.1439 24.0159 87.5774 25.3749C87.0397 26.7339 86.2753 27.9088 85.2841 28.8998C84.3217 29.8624 83.1607 30.6268 81.8017 31.1931C80.4714 31.731 78.9988 32 77.385 32C75.7712 32 74.2848 31.731 72.9258 31.1931C71.5955 30.6268 70.4345 29.8624 69.4434 28.8998C68.481 27.9088 67.7165 26.7339 67.1501 25.3749C66.6124 24.0159 66.3432 22.5295 66.3432 20.9157C66.3432 19.3019 66.6124 17.8155 67.1501 16.4565C67.7165 15.0975 68.481 13.9367 69.4434 12.9741C70.4345 11.9832 71.5955 11.2187 72.9258 10.6808C74.2848 10.1146 75.7712 9.83146 77.385 9.83146ZM77.385 26.8613C78.0932 26.8613 78.7727 26.7339 79.4235 26.4791C80.103 26.196 80.6976 25.7996 81.2072 25.29C81.7168 24.7803 82.1133 24.1575 82.3963 23.4214C82.7079 22.6852 82.8634 21.85 82.8634 20.9157C82.8634 19.9814 82.7079 19.1462 82.3963 18.4101C82.1133 17.6739 81.7168 17.0511 81.2072 16.5415C80.6976 16.0318 80.103 15.6496 79.4235 15.3948C78.7727 15.1117 78.0932 14.9701 77.385 14.9701C76.6492 14.9701 75.9554 15.1117 75.3041 15.3948C74.6532 15.6496 74.0725 16.0318 73.5629 16.5415C73.0532 17.0511 72.6429 17.6739 72.3313 18.4101C72.0483 19.1462 71.9066 19.9814 71.9066 20.9157C71.9066 21.85 72.0483 22.6852 72.3313 23.4214C72.6429 24.1575 73.0532 24.7803 73.5629 25.29C74.0725 25.7996 74.6532 26.196 75.3041 26.4791C75.9554 26.7339 76.6492 26.8613 77.385 26.8613ZM91.7946 31.3205V0.913082H97.3579V31.3205H91.7946ZM116.518 28.6025H116.178C115.527 29.65 114.649 30.4853 113.545 31.1081C112.441 31.7027 111.181 32 109.766 32C107.133 32 105.165 31.1931 103.862 29.5793C102.588 27.9655 101.951 25.8138 101.951 23.1241V10.511H107.515V22.4446C107.515 23.9452 107.84 25.0635 108.492 25.7996C109.171 26.5074 110.148 26.8613 111.422 26.8613C112.186 26.8613 112.851 26.7056 113.418 26.3941C114.012 26.0544 114.508 25.6155 114.904 25.0776C115.329 24.5114 115.64 23.8602 115.839 23.1241C116.065 22.3596 116.178 21.5527 116.178 20.7034V10.511H121.742V31.3205H116.518V28.6025ZM131.731 13.2289H132.071C132.722 12.1814 133.599 11.3603 134.704 10.7658C135.808 10.1429 137.068 9.83146 138.483 9.83146C139.785 9.83146 140.932 10.0438 141.923 10.4685C142.914 10.8932 143.721 11.5019 144.344 12.2946C144.995 13.0591 145.476 13.9934 145.788 15.0975C146.128 16.1734 146.298 17.3767 146.298 18.7074V31.3205H140.734V19.3869C140.734 17.8863 140.394 16.7821 139.715 16.0743C139.064 15.3382 138.101 14.9701 136.827 14.9701C136.063 14.9701 135.383 15.14 134.789 15.4798C134.222 15.7912 133.727 16.23 133.302 16.7963C132.906 17.3342 132.595 17.9854 132.368 18.7498C132.17 19.486 132.071 20.2787 132.071 21.1281V31.3205H126.507V10.511H131.731V13.2289ZM152.108 15.2674H148.456V10.511H152.108V4.14068H157.672V10.511H162.768V15.2674H157.672V23.3364C157.672 23.8177 157.714 24.2707 157.799 24.6954C157.913 25.0918 158.111 25.4315 158.394 25.7147C158.79 26.1676 159.357 26.3941 160.092 26.3941C160.574 26.3941 160.956 26.3517 161.239 26.2667C161.522 26.1535 161.791 26.0119 162.046 25.8421L163.617 30.7259C162.966 31.0374 162.258 31.2638 161.494 31.4054C160.758 31.5753 159.937 31.6602 159.031 31.6602C157.983 31.6602 157.035 31.5045 156.185 31.1931C155.365 30.8533 154.671 30.4004 154.104 29.8341C152.774 28.56 152.108 26.7481 152.108 24.3981V15.2674ZM170.168 7.49569C169.687 7.49569 169.22 7.41075 168.766 7.24088C168.342 7.04271 167.96 6.7879 167.62 6.47645C167.309 6.1367 167.054 5.75449 166.855 5.3298C166.686 4.90512 166.601 4.43796 166.601 3.92834C166.601 3.41872 166.686 2.95157 166.855 2.52688C167.054 2.1022 167.309 1.73416 167.62 1.4227C167.96 1.08296 168.342 0.828145 168.766 0.658271C169.22 0.460103 169.687 0.360992 170.168 0.360992C171.159 0.360992 172.008 0.714914 172.716 1.4227C173.424 2.1022 173.778 2.93739 173.778 3.92834C173.778 4.91929 173.424 5.76866 172.716 6.47645C172.008 7.15594 171.159 7.49569 170.168 7.49569ZM167.407 31.3205V10.511H172.971V31.3205H167.407ZM178.059 10.511H183.282V13.3988H183.622C183.877 12.8892 184.216 12.422 184.641 11.9973C185.066 11.5727 185.533 11.2046 186.043 10.8932C186.58 10.5817 187.147 10.3411 187.741 10.1712C188.364 10.0013 188.973 9.91639 189.568 9.91639C190.303 9.91639 190.927 9.98716 191.436 10.1287C191.974 10.2703 192.427 10.4543 192.795 10.6808L191.309 15.7346C190.969 15.5647 190.587 15.4373 190.162 15.3524C189.766 15.2391 189.27 15.1825 188.676 15.1825C187.911 15.1825 187.217 15.3382 186.594 15.6496C185.972 15.9327 185.434 16.3433 184.981 16.8812C184.556 17.4191 184.216 18.0562 183.962 18.7923C183.735 19.5001 183.622 20.2787 183.622 21.1281V31.3205H178.059V10.511Z"
            fill="#212121"
          />
          <path
            opacity="0.9"
            d="M7.43198 16.4565L14.864 31.3205H0L7.43198 16.4565Z"
            fill="#212121"
          />
          <path
            d="M7.43198 14.864C11.5365 14.864 14.864 11.5365 14.864 7.43198C14.864 3.32741 11.5365 0 7.43198 0C3.32741 0 0 3.32741 0 7.43198C0 11.5365 3.32741 14.864 7.43198 14.864Z"
            fill="#0288D1"
          />
        </svg>
      </NavLink>

      <div className="navbar-right">
        {isDarkSwitchActive && <TopnavDarkSwitch />}
        <div className="user d-inline-block">
          <UncontrolledDropdown className="dropdown-menu-right">
            <DropdownToggle className="p-0" color="empty">
              <span className="name mr-1">{userData?.name}</span>
              <span>
                <img alt="Profile" src={userData?.photo || '/peduly.png'} />
              </span>
            </DropdownToggle>
            <DropdownMenu className="mt-3" right>
              {/* <DropdownItem>Account</DropdownItem>
              <DropdownItem>Features</DropdownItem>
              <DropdownItem>History</DropdownItem>
              <DropdownItem>Support</DropdownItem>
              <DropdownItem divider /> */}
              <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps = ({ menu, settings }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu
  const { locale } = settings
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
  }
}
export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnamesAction: setContainerClassnames,
    clickOnMobileMenuAction: clickOnMobileMenu,
    logoutUserAction: logoutUser,
    changeLocaleAction: changeLocale,
  })(TopNav)
)

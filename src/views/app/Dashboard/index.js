import React, { useEffect, useState } from 'react'
import { Col, Row } from 'reactstrap'
import MiniCard from './components/RingkasanGalangDana/MiniCard'
import ListUserCard from './components/RingkasanPengguna/ListUserCard'
import GrafikTotalDonasi from './components/RingkasanGalangDana/GrafikTotalDonasi'
import { barChartData } from 'data/charts'

import http from 'helpers/http'
import { API_ENDPOINT } from 'config/api'
import moment from 'moment'
import GrafikKategoriGalangDana from './components/GrafikKategoriGalangDana'
import { CategoryGalangDana } from 'data/category-galang-dana'
import GrafikTotalGalangDana from './components/GrafikTotalGalangDana'
import MiniCard2 from '../../../components/MiniCard2'
import UserIcon from 'assets/icons/UserIcon'
import TrendingGalangDana from './components/TrendingGalangDana'
// import BarSingle from 'components/charts/BarSingle'

/* eslint-disable no-unused-vars */
const Dashboard = () => {
  // { match }
  const [listUser, setListUser] = useState([])
  const [listGalangDana, setListGalangDana] = useState([])
  const [listCategoryGalangData] = useState(CategoryGalangDana)
  const maxTrendingItem = 5

  useEffect(() => {
    getGalangDana()
    getUser()
  }, [])

  const getGalangDana = () => {
    http
      .get(API_ENDPOINT.GET_LIST_GALANG_DANA)
      .then((res) => {
        setListGalangDana(res.data.data)
      })
      .catch((err) => {
        console.log('Error get galang dana data: ', err)
      })
  }

  const getUser = () => {
    http
      .get(API_ENDPOINT.GET_ALL_USER)
      .then((res) => {
        setListUser(res.data.data)
      })
      .catch((err) => {
        console.log('Error get user data: ', err)
      })
  }

  const galangDanaActive = listGalangDana?.filter((data) => {
    return moment(data.batas_waktu_campaign, 'YYYY-MM-DD').isAfter(moment())
  })

  const galangDanaNonActive = listGalangDana?.filter((data) => {
    return !moment(data.batas_waktu_campaign, 'YYYY-MM-DD').isAfter(moment())
  })

  const trendingGalangDana = galangDanaActive
    ?.sort((a, b) => {
      const trendingMultiplier = (dateCreated, donatur) => {
        const daysToGo = moment(dateCreated).diff(moment(), 'days')

        return parseInt(donatur) / Math.abs(daysToGo)
      }
      return (
        trendingMultiplier(b.created_at, b.donations_count) -
        trendingMultiplier(a.created_at, a.donations_count)
      )
    })
    .slice(0, maxTrendingItem)

  const filterNewUser = listUser
    ?.filter((data) => {
      // filter user with role user
      return data.role === 'User'
    })
    .filter((user) => {
      const dayAgo = moment().subtract(30, 'days')
      return moment(user.tanggal_dibuat, 'DD/MM/YYYY HH:mm').isSameOrAfter(
        dayAgo
      )
    })

  return (
    <div className="dashboard" style={{ paddingBottom: '20px' }}>
      <Row>
        <Col>
          <h1>Ringkasan Galang Dana</h1>
        </Col>
      </Row>
      <Row className="section-1-container mb-4">
        <Col>
          <div className="section-1-left">
            <div className="top-mini-card">
              <MiniCard judul="Aktif" text={galangDanaActive?.length} />
              <MiniCard
                judul="Tidak Aktif"
                text={galangDanaNonActive?.length}
              />
              <MiniCard judul="Total" text={listGalangDana?.length} />
            </div>
            <div className="bottom-mini-card">
              <GrafikTotalDonasi barChartData={barChartData} />
            </div>
          </div>
        </Col>
        <Col>
          <TrendingGalangDana TrendingGalangDanaData={trendingGalangDana} />
        </Col>
      </Row>
      <Row className="section-2-container">
        <Col>
          <GrafikTotalGalangDana galangDanaData={listGalangDana} />
        </Col>
        <Col>
          <GrafikKategoriGalangDana categoryData={listCategoryGalangData} />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <h1>Ringkasan Pengguna</h1>
        </Col>
      </Row>
      <Row className="section-3-container" style={{ marginBottom: '32px', rowGap: '16px' }}>
        <Col>
          <MiniCard2
            title="Jumlah Pengguna"
            text={listUser.length}
            icon={<UserIcon />}
          />
        </Col>
        <Col>
          <MiniCard2
            title="Pengguna Baru"
            text={listUser.length}
            icon={<UserIcon />}
          />
        </Col>
        <Col>
          <MiniCard2 title="Biaya Operasional" text={listUser.length} />
        </Col>
        <Col>
          <MiniCard2 title="Total Payable" text={listUser.length} />
        </Col>
      </Row>
      <Row className="section-4-container">
        <Col>
          <div className="card"></div>
        </Col>
        <Col>
          <div className="card"></div>
        </Col>
        <Col>
          <ListUserCard ListUser={filterNewUser} />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

import Script from 'next/script'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { use, useEffect, useState } from 'react'
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Router, { useRouter, withRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';



export default function Rigister() {
  const baseUrl = "animeta.aucfan-cn.com"
  const [showModal, setShowModal] = useState(false)
  const [phonePrefixList, setPhonePrefixList] = useState([{ "prefix": 86 }, { "prefix": 1 }])
  const [selectedPrefix, setSelectedPrefix] = useState<Number | String>(86)
  const [phoneNumber, setPhoneNumber] = useState<Number | String>()
  const [verifyCode, setVerifyCode] = useState<Number | String>()
  const [uuid, setUuid] = useState<String | String[] | undefined>()
  const [inviteRank, setInviteRank] = useState([])
  const [invitorMsg, setInvitorMsg] = useState<{ nickname: String, avatar_url: string, uuid: string, status: Boolean, register_time: string, invitation_code: string } | undefined>()
  const [enGetVerify, setEnGetVerify] = useState(true)
  const [verfiyCd, setVerifyCD] = useState(10)
  // axios.defaults.withCredentials = true;
  const router = useRouter();

  // class TencentCaptcha {
  //   constructor(public appid: string, callback:(res: { ret: number; ticket: any; randstr: any})=>void){}
  // };
  
  

  const getVarifyCode = () => {

    if (!phoneNumber) {
      toast.error("未填写手机号码！")
      setEnGetVerify(true)
      return null
    }

    let appid = '198836766'; // 腾讯云控制台中对应这个项目的 appid
    //生成一个滑块验证码对象
    let captcha = new TencentCaptcha(appid, function (res: { ret: number; ticket: any; randstr: any; }) {
      // 用户滑动结束或者关闭弹窗，腾讯返回的内容  
      console.log(res)
      if (res.ret === 0) {
        //成功，传递数据给后台进行验证
        axios.post(`http://${baseUrl}/index/inviting/get_phone_code_by_login`, {
          ticket: res.ticket,
          randstr: res.randstr,
          phone: phoneNumber,
          phone_prefix: selectedPrefix
          // 其他参数
        })
          .then(
            // 后台验证通过，返回用户信息
            // 前端接收并登陆系统  
            res => {
              console.log(res)
              res.data.code == 200 ? toast.success("手机验证码已成功发送！") : toast.error(res.data.message)

              setEnGetVerify(false)
            }
          )
          .catch(
          // 验证失败    
        )
      } else {
        // 提示用户完成验证
      }
    });
    // 滑块显示
    captcha.show();
  }

  const getPhonePrefix = () => {
    axios.get(`http://${baseUrl}/index/com/get_phone_prefix`).then(res => {
      // console.log(res.data.data)
      setPhonePrefixList(res.data.data)
    }).catch(
      // 验证失败
      // setPhonePrefixList()
    )
  }

  const getInvitRank = () => {
    axios.get(`http://${baseUrl}/index/inviting/get_rank`, {
    })
      .then(
        // 后台验证通过，返回用户信息
        // 前端接收并登陆系统  
        res => {
          console.log(res.data.data)
          setInviteRank(res.data.data)
        }
      )
      .catch(
      // 验证失败    
    )

  }

  const getInvitHistory = (uuid: String | String[]) => {
    axios.get(`http://${baseUrl}/index/inviting/get_record_of_invitation?uuid=${uuid}`, {
    })
      .then(
        // 后台验证通过，返回用户信息
        // 前端接收并登陆系统  
        res => {
          console.log(res.data.data.user_msg)
          setInvitorMsg(res.data.data.user_msg)

        }
      )
      .catch(
      // 验证失败    
    )

  }

  const confirmRegister = () => {
    if (!(phoneNumber && verifyCode && invitorMsg)) {
      toast.error("信息未填写完整！")
      console.log("信息未填写完整！")
      return null
    }

    axios.post(`http://${baseUrl}/index/inviting/login_by_phone`, {
      phone: phoneNumber,
      phone_code: verifyCode,
      inviter_code: invitorMsg.invitation_code
      // 其他参数
    },)
      .then(
        // 后台验证通过，返回用户信息
        // 前端接收并登陆系统  

        res => {
          console.log(res.data.message, res.data.code)
          if (res.data.code == 200) { toast.success("注册成功！"); setShowModal(false) } else {
            toast.error(res.data.message);
            console.log(res.data.message)
          }
        }
      )
      .catch(
      // 验证失败    
    )
  }

  useEffect(() => {
    getPhonePrefix()
    getInvitRank()
  }, [])

  useEffect(() => {

    uuid && getInvitHistory(uuid)
  }, [uuid])

  useEffect(() => {
    if (!router.isReady) return;

    console.log(router.query.uuid)
    setUuid(router.query.uuid)
  }, [router.isReady])

  useEffect(() => {
    if (!enGetVerify) {
      let count = 10
      var interval = setInterval(() => {
        setVerifyCD(count)
        count -= 1
        if (count <= 0) {
          setEnGetVerify(true)
          clearInterval(interval);
        }
      }, 1000)
    }

  }, [enGetVerify])

  return (

    <div className="">
      <Script src="https://ssl.captcha.qq.com/TCaptcha.js"></Script>
      <Toaster />
      <Head>
        <title>注册有礼 Animeta</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />

      </Head>

      <div className='tw-bg-black tw-w-screen  tw-min-h-screen tw-text-white'>

        <div className='tw-absolute tw-flex tw-w-full tw-justify-center tw-flex-row' >
          <Image className='tw-animate-pulse tw-z-0 tw-mt-10' src={'./img/text_bg_img.png'} width={500} height={500} alt="" style={{ animationDuration: "1.5s", animationDelay: "3s" }} />

          {invitorMsg && <div className='tw-absolute tw-flex tw-flex-col tw-z-10'>
            <div className='lg:tw-w-[500px] tw-h-auto tw-mt-10 tw-flex tw-flex-row tw-items-center tw-space-x-2'>
              <img className='tw-w-10 tw-h-10 tw-rounded-full tw-ring-2 tw-ring-white tw-ml-4' src={invitorMsg.avatar_url}  />
              <p className='tw-text-2xl '>{invitorMsg.nickname} 邀请您参与活动！</p>
            </div>
            <div className=' tw-text-2xl lg:tw-w-[500px] tw-h-[50px] tw-flex tw-flex-row tw-items-end'>
              <p className=' tw-ml-4'>邀请码：</p>
              <p className='tw-text-blue-500 tw-align-top tw-text-4xl'>{invitorMsg.invitation_code}</p>
            </div>
          </div>}




          <div className='tw-absolute tw-place-self-center tw-mt-[300px]'>
            <div className='motion-safe:tw-animate-bounce tw-flex tw-flex-col ' style={{ animationDuration: "1.5s" }} >
              <Image className=' tw-place-self-center  tw-animate-ping tw-absolute' src={'./img/box.png'} width={200} height={200} alt="" style={{ animationDuration: "1.5s", animationDelay: "0.75s" }} />
              <Image className=' tw-place-self-center  tw-relative tw-z-1' src={'./img/box.png'} width={200} height={200} alt="" />
            </div>

            <div className=' tw-bg-gray-400/50 tw-rounded-lg'>
              <p className='tw-text-sm tw-text-white'>
                注册并成功充值 1 USDT/USDC 即可获得限量盲盒一个！
              </p>
            </div>

            <div className="tw-z-20 tw-mt-10 tw-flex tw-justify-center">
              <button className="tw-z-20 tw-ds-btn tw-glass tw-ds-btn-info tw-text-white" onClick={() => { setShowModal(true) }}>立即注册
              </button>
            </div>

            <div className='tw-mt-10 tw-text-white tw-flex tw-justify-center'>
              <div className='tw-flex tw-flex-row '>
                <Image className='tw-relative' src={'./img/shell_icon.png'} width={20} height={20} alt="" />
                <p>盲盒领取排行</p>
                <Image className='tw-relative' src={'./img/shell_icon.png'} width={20} height={20} alt="" />
              </div>
            </div>

            <div className='tw-w-full tw-text-gray-300 tw-text-xl tw-mt-4 tw-px-4  tw-space-y-2 '>
              {inviteRank && inviteRank.map((item: { avatar_url: string, nickname: string, count_num: string }, index) => (
                <div key={index} className='tw-flex tw-flex-row tw-justify-between tw-items-center tw-space-x-1 '>
                  <div className='tw-flex tw-flex-row tw-space-x-3 tw-items-center '>
                    <p>{index + 1}</p>
                    <img className='tw-w-6 tw-h-6 tw-rounded-full tw-ring-1 tw-ring-white' src={item.avatar_url}  />
                    <div className='tw-flex tw-flex-col tw-text-sm'>
                      <p>{item.nickname}</p>
                    </div>
                  </div>

                  <div className='tw-flex tw-flex-col tw-text-sm'>
                    <div className='tw-text-right tw-text-blue-500  tw-flex tw-flex-row'><p className='tw-pr-2 tw-text-white'>已领取盲盒  </p> * {item.count_num}</div>
                  </div>


                </div>
              ))
              }



              {showModal && <div className='tw-flex '>

                <div className='tw-fixed tw-w-screen tw-h-full tw-right-0 tw-top-0 tw-z-30 tw-bg-black/70 tw-flex tw-justify-center' onClick={() => { setShowModal(false) }}>
                </div>


                <div className='tw-fixed tw-w-[300px] tw-h-[300px] tw-bg-white/90 tw-rounded-lg tw-flex tw-flex-col tw-z-40 tw-top-[300px]' onClick={() => { setShowModal(true) }}>
                  <p className='tw-self-center tw-mt-4 tw-text-gray-700'>手机注册</p>
                  <div className="tw-ds-form-control tw-p-4 ">
                    <div className="tw-ds-input-group tw-flex-row">
                      <select className="tw-ds-select tw-ds-select-bordered tw-text-gray-700" onChange={(e) => { setSelectedPrefix(e.target.value) }}>
                        {phonePrefixList.map((item,index) => (
                          <option key={index} value={item.prefix}>+{item.prefix}</option>
                        ))}

                      </select>
                      <input type="text" placeholder="请输入手机号码" className="tw-ds-input tw-ds-input-bordered" style={{ width: "100%" }} onChange={(e) => { setPhoneNumber(e.target.value) }} />
                    </div>
                  </div>
                  <div className='tw-p-4 tw-flex tw-flex-row  tw-items-center tw-justify-between'>
                    <input type="text" placeholder="验证码" className="tw-ds-input tw-ds-input-bordered tw-text-gray-600" style={{ width: "50%" }} onChange={(e) => { setVerifyCode(e.target.value) }} />
                    {enGetVerify ? <p className='tw-text-blue-400 tw-pr-4  tw-cursor-pointer active:tw-text-green-500' onClick={() => { getVarifyCode(); }}>获取验证码</p> : <p className='tw-text-gray-400 tw-text-sm active:tw-text-green-500' >{verfiyCd}s 后可重新获取</p>}
                  </div>
                  <div className='tw-p-4 tw-flex tw-flex-row  tw-items-center tw-justify-center'>
                    <button className="tw-ds-btn tw-ds-btn-wide" onClick={() => { confirmRegister() }}>注册</button>
                  </div>

                </div>





              </div>
              }
            </div>
          </div>

        </div>

      </div>
      {/* <ReactSimpleVerify  success={ ()=>{console.log("success")} }/> */}




    </div>
  )
}

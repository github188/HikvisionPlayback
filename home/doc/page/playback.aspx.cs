using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class playback : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected string token
    {
        get
        {
            return Request.QueryString["token"] ?? "";
        }
    }

    protected string cameraId
    {
        get
        {
            return Request.QueryString["camera"] ?? "";
        }
    }

    protected string mm_szHostName
    {
        get { return Request.QueryString["ip"] ?? ""; }
    }
    protected string m_szUserPwdValue
    {
        get
        {
            return ConfigurationManager.AppSettings["m_szUserPwdValue"].ToString();
        }
    }
    protected string m_szHostName
    {
        get { return Request.QueryString["ip"] ?? ""; }
    }
    protected string m_lHttpPort
    {
        get { return Request.QueryString["port"] ?? ""; }
    }
    protected string m_lRtspPort
    {
        get
        {
            return Request.QueryString["rtsp"] ?? "";
        }
    }
    protected string m_UserName
    {
        get { return Request.QueryString["u"] ?? ""; }
    }
    protected string m_Password
    {
        get { return Request.QueryString["p"] ?? ""; }
    }

    protected string m_Channel { get { return Request.QueryString["cha"] ?? "101"; } }
}
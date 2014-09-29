using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;

public partial class preview : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected string mm_szHostName
    {
        get
        {
            return ConfigurationManager.AppSettings["m_szHostName"].ToString();
        }
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
        get
        {
            return ConfigurationManager.AppSettings["m_szHostName"].ToString();
        }
    }
    protected string m_lHttpPort
    {
        get
        {
            return ConfigurationManager.AppSettings["m_lHttpPort"].ToString();
        }
    }
    protected string m_lRtspPort
    {
        get
        {
            return ConfigurationManager.AppSettings["m_lRtspPort"].ToString();
        }
    }
}
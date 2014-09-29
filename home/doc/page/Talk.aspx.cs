using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Net;
using System.IO;

public partial class Talk : System.Web.UI.Page
{
    string _szHostName;
    string _lHttpPort;
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request.QueryString["url"] != null)
        {
            string[] strArray = Request.QueryString["url"].Split(':');
            _szHostName = strArray[0];
            _lHttpPort = strArray[1];
        }
    }
    protected string mm_szHostName
    {
        get
        {
            //GetIpPortAddByMachAddress();
            return _szHostName;

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
            return _szHostName;
        }
    }
    protected string m_lHttpPort
    {
        get
        {
            return _lHttpPort;
        }
    }
    protected string m_lRtspPort
    {
        get
        {
            return ConfigurationManager.AppSettings["m_lRtspPort"].ToString();
        }
    }
    public void GetIpPortAddByMachAddress()
    {

        var machAddress = string.Format("http://212.78.237.158/XmlHandler.ashx?mac={0}&param=RealIpAddress", ConfigurationManager.AppSettings["MacAddress"].ToString());
        System.Net.WebRequest req = System.Net.WebRequest.Create(machAddress);

        //req.Credentials = new NetworkCredential("admin", "12345");
        req.Method = "GET";
        string ResultString;
        string ContentType;
        using (var response = (HttpWebResponse)req.GetResponse())
        {
            ResultString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            ContentType = response.ContentType;
            response.Close();
        }

        string[] strArray = ResultString.Split(':');
        _szHostName = strArray[0];
        _lHttpPort = strArray[1];
    }
}
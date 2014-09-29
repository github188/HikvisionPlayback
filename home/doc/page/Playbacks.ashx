<%@ WebHandler Language="C#"  Class="Playbacks" %>

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Xml;
using System.Xml.Linq;
using System.Configuration;
using System.Web.Script.Serialization;


    public class Playbacks : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string method = context.Request.QueryString["method"].ToString().ToLower();
            string url = context.Request.QueryString["url"].ToString().ToLower();
            string userName = context.Request.QueryString["u"].ToString().ToLower();
            string password = context.Request.QueryString["p"].ToString().ToLower();

            if (method == "search")
            {
                // string param = "myparam";
                var data = context.Request;
                var sr = new StreamReader(data.InputStream);
                var stream = sr.ReadToEnd();


                byte[] array = Search(stream, url, userName, password);
                context.Response.Clear();
               // context.Response.AddHeader("HTTP/1.0", "200");
                context.Response.ContentType = "application/xml";
                context.Response.OutputStream.Write(array, 0, array.Length);
                context.Response.Flush();

            }
        }
        private byte[] Search(string xmlData, string url,string userName, string password)
        {
            return SearchVideoContent(url, userName, password, xmlData);
        }
        public static byte[] SearchVideoContent(string publicUrl, string userName, string password,string xmlData)
        {
            var url = string.Format("http://{0}/PSIA/ContentMgmt/search/", publicUrl);
        
            WebClient client = new WebClient();
         //   string xmlData =
         //     string.Format(
           //         @"<?xml version='1.0' encoding='utf-8'?><CMSearchDescription><searchID>C5954E12-60B0-0001-954E-999096EF7420</searchID><trackList><trackID>101</trackID></trackList><timeSpanList><timeSpan><startTime>2013-02-18T00:00:00Z</startTime><endTime>2013-02-19T00:10:00Z</endTime></timeSpan></timeSpanList><maxResults>40</maxResults><searchResultPostion>0</searchResultPostion><metadataList><metadataDescriptor>//metadata.psia.org/VideoMotion</metadataDescriptor></metadataList></CMSearchDescription>");
            byte[] byteArray = Encoding.UTF8.GetBytes(xmlData);
            client.Credentials = new NetworkCredential(userName, password);
            client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
           
            byte[] responseArray = client.UploadData(url, "POST", byteArray);
            return responseArray;
           
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
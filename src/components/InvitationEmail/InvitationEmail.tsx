type InvitationEmailProps = {
  member: string;
  data: InvitationEmailDataProps;
};

type InvitationEmailDataProps = {
  leader_name: string;
  id: string;
  name: string;
};
function InvitationEmail({ data, member }: InvitationEmailProps) {
  return (
    <>
      <div>
        <p>
          Hi {member}
          {" , "}{" "}
        </p>
        <p
          style={{
            paddingLeft: "1.5rem",
          }}
        >
          <b>{data.leader_name}</b> has added you to their team for the project
          {"  "}
          <i>
            <a
              href={
                data.id
                  ? `${process.env.BASE_URL}/projects/${data.id}`
                  : `${process.env.BASE_URL}/projects/`
              }
              target="_blank"
              rel="noreferrer"
            >
              {data.name}
            </a>
          </i>{" "}
          . Login to{" "}
          <a href={process.env.BASE_URL} target="_blank" rel="noreferrer">
            IEDC Collab
          </a>{" "}
          to check out.
        </p>
        <br />
        <div>
          <p>
            To view more details , Vist{" "}
            <a href={process.env.BASE_URL} target="_blank" rel="noreferrer">
              {process.env.BASE_URL}
            </a>
          </p>
        </div>
        <p>Regards</p>
        <p>IEDC MEC Collab Team</p>
        <br />
        <p>
          NOTE : This is an auto generated email.Please DO NOT REPLY to this
          mail.
        </p>
        <p>
          <i>
            For any queries please visit{" "}
            <a href="https://www.iedcmec.in">https://www.iedcmec.in</a>
          </i>
        </p>
      </div>
    </>
  );
}
export default InvitationEmail;

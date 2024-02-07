import Glow from "../quarks/Glow";
import Ellipsis from "../quarks/Ellipsis";

export const Background = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  return (
    <>
      <div className="overflow-y-scroll scrollbar-hide h-full">
        <>{children}</>
      </div>
      <div className="scrollbar-hide">
        <Glow
          position={{
            top: "-661px",
            left: "203px",
          }}
          size={{
            width: "1175px",
            height: "1169px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, rgba(30,50,90,0.50) 0%, rgba(59, 35, 78, 0.00) 100%)"
        />
        <Glow
          position={{
            bottom: "-30.47%",
            left: "17.55%",
          }}
          size={{
            width: "1209px",
            height: "1205px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, rgba(10, 40, 120, 0.70) 0%, rgba(90, 30, 70, 0.00) 100%)"
        />
        <Glow
          position={{
            top: "-14.47%",
            left: "37.55%",
          }}
          size={{
            width: "1209px",
            height: "1205px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, rgba(10, 40, 120, 0.70) 0%, rgba(90, 30, 70, 0.00) 100%)"
        />
        <Glow
          position={{
            top: "-50%",
            left: "0%",
          }}
          size={{
            width: "1209px",
            height: "2505px",
          }}
          background="radial-gradient(50% 50% at 50% 50%,  rgba(30, 50, 90, 0.50) 0%, rgba(90, 30, 70, 0.00) 100%)"
        />
        <Glow
          position={{
            top: "-45%",
            right: "-10%",
          }}
          size={{
            width: "1209px",
            height: "2505px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, #3B234E 0%, rgba(90, 30, 70, 0.00) 100%)"
        />

        <Glow
          position={{
            top: "-45%",
            right: "-30%",
          }}
          size={{
            width: "1209px",
            height: "2505px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, #3B234E 0%, rgba(90, 30, 70, 0.00) 100%)"
        />
        <Glow
          position={{
            top: "-60px",
            left: "-150px",
          }}
          size={{
            width: "879px",
            height: "875px",
          }}
          background="radial-gradient(50% 50% at 50% 50%, rgba(48, 42, 96, 0.30) 0%, rgba(48, 42, 96, 0.00) 100%)"
        >
          <div className="scrollbar-hide">
            <Ellipsis width={1024} height={998} marginTop={80} marginLeft={43}>
              <Ellipsis width={768} height={768} marginTop={56} marginLeft={81}>
                <Ellipsis
                  width={594}
                  height={592}
                  marginTop={45}
                  marginLeft={38}
                >
                  <Ellipsis
                    width={380}
                    height={380}
                    marginTop={45}
                    marginLeft={46}
                  />
                </Ellipsis>
              </Ellipsis>
            </Ellipsis>
          </div>
        </Glow>
      </div>
    </>
  );
};

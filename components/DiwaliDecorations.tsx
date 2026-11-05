
"use client";

const bulbs = Array.from({ length: 18 }, (_, index) => index);

export default function DiwaliDecorations() {
  return (
    <div
      aria-hidden="true"
      className="diwali-decorations pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {/* Festive string lights */}
      <div className="diwali-lights">
        <div className="diwali-wire" />

        {bulbs.map((bulb) => (
          <span
            key={bulb}
            className={`diwali-bulb bulb-${bulb % 5}`}
            style={{
              left: `${(bulb / (bulbs.length - 1)) * 100}%`,
              animationDelay: `${(bulb % 6) * 0.18}s`,
            }}
          />
        ))}
      </div>

      {/* Animated fireworks */}
      <div className="diwali-firework firework-one" />
      <div className="diwali-firework firework-two" />
      <div className="diwali-firework firework-three" />

      <style jsx>{`
        .diwali-lights {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 48px;
        }

        .diwali-wire {
          position: absolute;
          top: 8px;
          left: -2%;
          width: 104%;
          height: 28px;
          border-top: 1px solid rgba(153, 111, 43, 0.45);
          border-radius: 50%;
        }

        .diwali-bulb {
          position: absolute;
          top: 13px;
          width: 9px;
          height: 13px;
          border-radius: 50% 50% 45% 45%;
          transform: translateX(-50%);
          animation: bulb-glow 2.2s ease-in-out infinite;
          box-shadow: 0 0 9px currentColor;
        }

        .bulb-0 {
          color: #f5c45b;
          background: #f5c45b;
        }

        .bulb-1 {
          color: #e87965;
          background: #e87965;
        }

        .bulb-2 {
          color: #e8d68a;
          background: #e8d68a;
        }

        .bulb-3 {
          color: #b6c98b;
          background: #b6c98b;
        }

        .bulb-4 {
          color: #dca6c4;
          background: #dca6c4;
        }

        .diwali-firework {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          opacity: 0;
          animation: firework-burst 4.8s ease-out infinite;
        }

        .diwali-firework::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #f3c65e;
          box-shadow:
            0 -38px #f3c65e,
            19px -33px #e8a76a,
            33px -19px #f4d98a,
            38px 0 #e8a76a,
            33px 19px #f3c65e,
            19px 33px #e8a76a,
            0 38px #f4d98a,
            -19px 33px #f3c65e,
            -33px 19px #e8a76a,
            -38px 0 #f4d98a,
            -33px -19px #f3c65e,
            -19px -33px #e8a76a,
            0 -25px #fff1b8,
            25px 0 #fff1b8,
            0 25px #fff1b8,
            -25px 0 #fff1b8;
          filter: drop-shadow(0 0 5px rgba(243, 198, 94, 0.7));
        }

        .firework-one {
          top: 23%;
          left: 13%;
          animation-delay: 0s;
        }

        .firework-two {
          top: 34%;
          right: 14%;
          animation-delay: 1.7s;
        }

        .firework-three {
          top: 67%;
          left: 78%;
          animation-delay: 3.2s;
          transform: scale(0.75);
        }

        @keyframes bulb-glow {
          0%,
          100% {
            opacity: 0.72;
            filter: brightness(0.9);
          }

          50% {
            opacity: 1;
            filter: brightness(1.5);
          }
        }

        @keyframes firework-burst {
          0% {
            opacity: 0;
            transform: scale(0.15);
          }

          12% {
            opacity: 0.9;
            transform: scale(0.7);
          }

          35% {
            opacity: 0.65;
            transform: scale(1);
          }

          65% {
            opacity: 0.25;
            transform: scale(1.15);
          }

          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }

        @media (max-width: 640px) {
          .diwali-bulb {
            width: 7px;
            height: 10px;
          }

          .firework-one {
            left: 8%;
            top: 25%;
            transform: scale(0.7);
          }

          .firework-two {
            right: 8%;
            top: 40%;
            transform: scale(0.65);
          }

          .firework-three {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .diwali-bulb,
          .diwali-firework {
            animation: none;
          }

          .diwali-bulb {
            opacity: 0.9;
          }

          .diwali-firework {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}

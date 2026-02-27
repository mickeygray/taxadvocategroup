import React from "react";

const testimonials = [
  {
    quote:
      "I went to Tax Advocate Group for my tax problem. I had a few different people try, but all they did was push paper around and keep me guessing. The Tax Advocate Group got me a deal I could afford with the IRS, and made the whole thing an understandable process.",
    author: "Rex W.",
    detail: "IRS Settlement",
  },
  {
    quote:
      "The Best!!! Excellent service and follow-through. Very thoughtful staff, and they kept me updated. Any situations that came up were handled immediately. They were able to do what I thought could never be done. Thank you, Tax Advocate Group!",
    author: "Cassie V.",
    detail: "Tax Resolution",
  },
  {
    quote:
      "When you receive a letter in the mail that has 'IRS' on it — you tend to lose a lot of sleep and sometimes don't even open the envelope! I've had that experience, and after making contact, I have to tell you, I slept better.",
    author: "Blanche S.",
    detail: "IRS Notice Response",
  },
  {
    quote:
      "GREAT JOB!!! Tax Advocate Group was able to release my wage garnishment within days. This is a fantastic company. If you have any tax issues, please give them a call!!!!!",
    author: "Jack M.",
    detail: "Wage Garnishment Release",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-v2">
      <div className="testimonials-v2__inner">
        <div className="testimonials-v2__header">
          <span className="section-label">Client Stories</span>
          <h2>Real Results From Real People</h2>
        </div>

        <div className="testimonials-v2__grid">
          {/* Featured testimonial */}
          <div className="testimonials-v2__featured">
            <blockquote>
              <p>"{testimonials[0].quote}"</p>
              <footer>
                <strong>{testimonials[0].author}</strong>
                <span>{testimonials[0].detail}</span>
              </footer>
            </blockquote>
          </div>

          {/* Side testimonials */}
          <div className="testimonials-v2__stack">
            {testimonials.slice(1).map((t, i) => (
              <div key={i} className="testimonials-v2__card">
                <p>"{t.quote}"</p>
                <footer>
                  <strong>{t.author}</strong>
                  <span>{t.detail}</span>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

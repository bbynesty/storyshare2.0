#pragma once

// Отключаем предупреждения
#ifdef _MSC_VER
#pragma warning(push)
#pragma warning(disable: 4005) // макро переопределение
#endif

// Определяем версии до включения заголовочных файлов
#ifndef BOOST_VERSION
#define BOOST_VERSION 107000
#endif

#ifndef ASIO_VERSION
#define ASIO_VERSION 101008
#endif

// Определяем макросы для Crow
#ifndef CROW_USE_BOOST
#define CROW_USE_BOOST
#endif

#ifndef CROW_USE_IO_CONTEXT
#define CROW_USE_IO_CONTEXT
#endif

#ifndef BOOST_ASIO_NO_DEPRECATED
#define BOOST_ASIO_NO_DEPRECATED
#endif

// Включаем необходимые заголовочные файлы Boost
#include <boost/asio.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ssl.hpp>

// Определяем псевдонимы для обратной совместимости
namespace boost {
namespace asio {
    using io_service = io_context;
}
}

// Восстанавливаем предупреждения
#ifdef _MSC_VER
#pragma warning(pop)
#endif